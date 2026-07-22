export function ManuscriptProof() {
  return (
    <div className="manuscript-proof">
      <aside className="manuscript-sidebar">
        <strong>Manuscript</strong>
        <nav aria-label="Manuscript demonstration navigation">
          <span className="is-current">Today</span>
          <span>Echoes</span>
          <span>Shelf</span>
        </nav>
        <span className="manuscript-private">Private archive</span>
      </aside>
      <article className="manuscript-editor">
        <header>
          <span>Draft · Today</span>
          <span>Saved privately</span>
        </header>
        <div className="manuscript-page">
          <p className="manuscript-kicker">Notes toward a durable idea</p>
          <h4>The work worth keeping</h4>
          <p>
            An idea becomes useful when it can survive contact with detail. The
            first draft finds the shape; revision finds what deserves to remain.
          </p>
          <p>
            Keep the observation close to its source. Let the language become
            clear before asking it to become impressive.
          </p>
          <p className="manuscript-caret-line">
            The archive is not the end of the work. It is where the work can
            begin again.<span aria-hidden="true" />
          </p>
        </div>
      </article>
    </div>
  );
}
