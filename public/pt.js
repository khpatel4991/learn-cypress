const { fromEvent, of, zip } = window.rxjs;
const { map, first, mergeMap, catchError, tap } = window.rxjs.operators;
const { ajax } = window.rxjs.ajax;

const main = async () => {
  const target = document.querySelector("textarea[data-pt-client-id]");
  const auth$ = fromEvent(target, "focus")
    .pipe(first())
    .pipe(
      mergeMap(event => {
        const clientId = event.target.dataset.ptClientId;
        return zip(
          of(event),
          ajax({
            url: "http://localhost:8081/auth",
            method: "POST",
            body: {
              clientId
            },
            headers: {
              "Content-Type": "application/json"
            }
          })
        );
      }),
      map(([event, res]) => {
        if (!res.response) {
          throw new Error("No Token Rec");
        }
        return [event, res.response.authToken];
      }),
      catchError(err => of(err))
    );

  auth$
    .pipe(
      tap(
        ([event, token]) => {
          event.target.classList.add("perfecttense");
          const ptEditor = document.createElement("div");
          ptEditor.classList.add("pte");
          ptEditor.dataset.authToken = token;
          const quill = new window.Quill(ptEditor);
          event.target.parentNode.insertBefore(ptEditor, event.target);
          return of(quill);
        },
        console.error,
        console.info
      )
    )
    .subscribe();

  // auth$.subscribe();
};

main();
