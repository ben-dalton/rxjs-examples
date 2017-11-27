import { Observable } from 'rxjs';

let output = document.getElementById('output');
let button = document.getElementById('button');

let click = Observable.fromEvent(button, 'click');

function load(url: string) {
  return Observable.create(observer => {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        observer.next(data);
        observer.complete();
      } else {
        observer.error(xhr.statusText);
      }
    })

    xhr.open('GET', url);
    xhr.send();
  }).retryWhen(retryStrategy({ attempts: 2, delay: 500 }));
};

function loadWithFetch(url: string) {
  return Observable.defer(() => {
    return Observable.fromPromise(
      fetch(url).then(r => {
        if (r.status === 200) {
          return r.json()
        } else {
          return Promise.reject(r);
        }
      }
    ));
  }).retryWhen(retryStrategy())
}

function retryStrategy({ attempts = 4, delay = 1000 } = {}) {
  return function(errors) {
    return errors
            .scan((acc, value) => {
              acc += 1;
              if (acc < attempts) {
                return acc;
              } else {
                throw new Error(value);
              }
            }, 0)
            .delay(delay);
  }
}

function renderMovies(movies) {
  movies.forEach(m => {
    let div = document.createElement('div');
    div.innerText = m.title;
    output.appendChild(div);
  })
}

click.flatMap(e => loadWithFetch('movies.json'))
     .subscribe(
        renderMovies,
        error => console.log(`error: ${error}`),
        () => console.log('complete')
     );
