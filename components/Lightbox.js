export default function Lightbox() {
  return (
    <div className="lightbox" id="lightbox" aria-hidden="true">
      <div className="lightbox-inner">
        <button className="lightbox-close" id="lightboxClose" aria-label="Close">&times;</button>
        <img id="lightboxImg" src={null} alt="" />
        <div className="lightbox-caption" id="lightboxCaption"></div>
      </div>
    </div>
  );
}
