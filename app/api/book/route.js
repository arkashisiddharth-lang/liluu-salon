import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const FRIENDLY_ERROR = "We couldn't submit your appointment request right now. Please try again in a moment, or message us directly on WhatsApp.";

function isValidDateNotInPast(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || '')) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = new Date(dateStr + 'T00:00:00');
  return picked >= today;
}

function isValidTime(timeStr) {
  return /^\d{2}:\d{2}$/.test(timeStr || '');
}

function isValidPhone(phone) {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: FRIENDLY_ERROR }, { status: 400 });
  }

  const {
    name,
    phone,
    email = null,
    service_id,
    appointment_date,
    appointment_time,
    notes = '',
  } = body || {};

  // ---- Server-side validation (defense in depth — never trust the client) ----
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ success: false, error: 'Please enter your name.' }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ success: false, error: 'Please enter a valid phone number.' }, { status: 400 });
  }
  if (!service_id) {
    return NextResponse.json({ success: false, error: 'Please select a service.' }, { status: 400 });
  }
  if (!isValidDateNotInPast(appointment_date)) {
    return NextResponse.json({ success: false, error: 'Please choose a valid date that is not in the past.' }, { status: 400 });
  }
  if (!isValidTime(appointment_time)) {
    return NextResponse.json({ success: false, error: 'Please choose a valid time.' }, { status: 400 });
  }

  try {
    // Confirm the service exists and is active — never trust a service_id blindly.
    const { data: service, error: serviceError } = await supabaseAdmin
      .from('services')
      .select('id, name, is_active')
      .eq('id', service_id)
      .single();

    if (serviceError || !service || !service.is_active) {
      return NextResponse.json({ success: false, error: 'That service is no longer available. Please choose another.' }, { status: 400 });
    }

    // ---- Insert the appointment (always starts as "pending") ----
    const { data: appointment, error: insertError } = await supabaseAdmin
      .from('appointments')
      .insert({
        customer_name: name.trim(),
        phone: phone.trim(),
        email: email ? String(email).trim() : null,
        service_id,
        appointment_date,
        appointment_time,
        notes: notes || '',
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[api/book] appointment insert failed:', insertError.message);
      return NextResponse.json({ success: false, error: FRIENDLY_ERROR }, { status: 500 });
    }

    // ---- Find-or-create the customer record, matched by phone ----
    // Uses upsert with phone as the conflict target so we never create
    // duplicate customer rows for repeat bookers. If your `customers` table
    // doesn't yet have a unique constraint on `phone`, add one:
    //   alter table customers add constraint customers_phone_key unique (phone);
    const { error: customerError } = await supabaseAdmin
      .from('customers')
      .upsert(
        {
          name: name.trim(),
          phone: phone.trim(),
          email: email ? String(email).trim() : null,
        },
        { onConflict: 'phone' }
      );

    if (customerError) {
      // Non-fatal: the appointment is already saved, so we log and continue
      // rather than failing the whole booking over a CRM-side hiccup.
      console.error('[api/book] customer upsert failed:', customerError.message);
    }

    // ---- Email notification (best-effort, never blocks the booking) ----
    const emailResult = await sendOwnerNotification({
      customerName: name.trim(),
      phone: phone.trim(),
      email,
      serviceName: service.name,
      date: appointment_date,
      time: appointment_time,
    });
    console.log('[api/book] Booking', appointment.id, '— email notification result:', emailResult.sent ? 'SENT' : `NOT SENT (${emailResult.reason})`);

    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    console.error('[api/book] unexpected error:', err);
    return NextResponse.json({ success: false, error: FRIENDLY_ERROR }, { status: 500 });
  }
}

async function sendOwnerNotification({ customerName, phone, email, serviceName, date, time }) {
  // Trim defensively — a stray trailing space/newline copied into .env.local
  // (very common when pasting keys) silently breaks the Authorization header
  // or produces an invalid "from"/"to" address, and looks identical to a
  // missing variable from the outside.
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const toEmail = (process.env.SALON_NOTIFICATION_EMAIL || '').trim();
  const fromEmail = (process.env.RESEND_FROM_EMAIL || '').trim();

  // ---- Safe diagnostics: presence only, never the actual values ----
  console.log('[api/book] RESEND_API_KEY present:', Boolean(apiKey));
  console.log('[api/book] SALON_NOTIFICATION_EMAIL present:', Boolean(toEmail));
  console.log('[api/book] RESEND_FROM_EMAIL present:', Boolean(fromEmail));

  if (!apiKey || !toEmail || !fromEmail) {
    console.warn('[api/book] Email notification skipped — one or more of RESEND_API_KEY, SALON_NOTIFICATION_EMAIL, RESEND_FROM_EMAIL is missing. Check .env.local and restart the dev server (env vars are only read at process start).');
    return { sent: false, reason: 'missing_env' };
  }

  const text = [
    'NEW APPOINTMENT REQUEST',
    '',
    'Customer:',
    customerName,
    '',
    'Phone:',
    phone,
    '',
    'Email:',
    email || '—',
    '',
    'Service:',
    serviceName,
    '',
    'Date:',
    date,
    '',
    'Time:',
    time,
    '',
    'Status:',
    'Pending',
    '',
    'This is a new appointment REQUEST and still needs confirmation in the admin dashboard.',
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        // Resend expects an array of recipients, not a bare string.
        to: [toEmail],
        subject: `New appointment request — ${customerName}`,
        text,
      }),
    });

    // Resend always returns a JSON body (success payload or error payload) —
    // parse it either way so we get a structured, useful message instead of
    // a raw/garbled string.
    let responseBody = null;
    try {
      responseBody = await res.json();
    } catch {
      responseBody = await res.text().catch(() => null);
    }

    if (!res.ok) {
      console.error('[api/book] Resend rejected the email — HTTP status:', res.status);
      console.error('[api/book] Resend error body:', responseBody);

      // The single most common cause of "insert succeeds but no email
      // arrives": Resend's shared sandbox sender (onboarding@resend.dev)
      // is only allowed to send to the email address you signed up to
      // Resend with. If SALON_NOTIFICATION_EMAIL is a different address,
      // every send will be rejected with exactly this kind of 403/422 —
      // the appointment still saves fine, which is why it can look like
      // "nothing is wrong" from the booking form's point of view.
      if (fromEmail === 'onboarding@resend.dev') {
        console.error(
          '[api/book] HINT: RESEND_FROM_EMAIL is the Resend sandbox address (onboarding@resend.dev). ' +
          'In sandbox mode, Resend only allows sending TO the email address used to sign up for your Resend account — ' +
          'sending to any other address (like your real SALON_NOTIFICATION_EMAIL) will be rejected. ' +
          'Fix: either (a) temporarily set SALON_NOTIFICATION_EMAIL to your Resend account\'s own email for testing, or ' +
          '(b) verify a real domain in Resend and set RESEND_FROM_EMAIL to an address on that domain — see https://resend.com/domains.'
        );
      }

      return { sent: false, reason: 'resend_error', status: res.status, body: responseBody };
    }

    console.log('[api/book] Resend accepted the email — HTTP status:', res.status, 'id:', responseBody && responseBody.id);
    return { sent: true, status: res.status, id: responseBody && responseBody.id };
  } catch (err) {
    // Network/DNS/etc failures must never fail the booking itself.
    console.error('[api/book] Resend request threw an exception:', err.message);
    return { sent: false, reason: 'exception', message: err.message };
  }
}
