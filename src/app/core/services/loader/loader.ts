import {
  Subscriber,
  concat,
  Observable,
  Subject,
  Subscription,
  of,
  throwError,
} from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

/**
 * Interfaz  que identifica a un objeto como `Notifiable`,
 * lo que sugiere que puede recibir notificaciones por parte
 * de un `Loader`.
 */
interface Notifiable {
  /**
   * Método a ejecutarse cuando comienza la carga de observables.
   */
  wait?();
  /**
   * Método a ejecutarse cuando termina la carga de todos los observables.
   */
  resume?();
  /**
   * Método a ejecutarse cuando se captura un error.
   * @param error el error capturado.
   */
  error?(error: any);
}

/**
 * Evento emitido por el loader ante los eventos de wait, resume y error.
 */
interface NotifiactionEvent {
  /**
   * El tipo de notificacion, que debe ser alguna de las keys de la
   * interfaz Notifiable.
   */
  key: 'wait' | 'resume' | 'error';
  /**
   * Los parámetros a usar en la llamada al método de Notifiable.
   */
  params?: any[];
}

/**
 * Las instancias de `LoaderCache` son `usadas` por un `Loader` para
 * no solo cargar observables y mantener el estado de la llamada, si no también
 * para guardar la primer respuesta según una llave (`key`).
 */
class LoaderCache {
  /**
   * Este simple objeto es la cache, para cada key se guardará una determinada respuesta.
   */
  private oCache: { [key: string]: () => Observable<any> } = {};

  constructor(private loaderService: Loader) {}

  /**
   * Carga el observable si y solo si no existe un elemento en el objeto cache con el mismo
   * nombre que la key pasada por parámetro.
   * @param observableFactory esto es una función factory, que deberá devolver el observable a llamar
   * y sólo se registra si la key no está en el cache.
   */
  load<T>(key: string, observableFactory: () => Observable<T>): Observable<T> {
    if (!this.oCache[key]) {
      const subject: Subject<T> = new Subject();
      this.oCache[key] = () => subject.asObservable();

      return new Observable(observer => {
        this.loaderService
          .load<T>(observableFactory())
          .pipe(
            tap(value => {
              this.set(key, value);
            }),
            catchError(err => {
              this.clear(key);
              return throwError(err);
            })
          )
          .subscribe(subject);
        subject.subscribe(observer);
      });
    }
    return this.get(key);
  }

  /**
   * Limpia la cache según el nombre pasado por parámetro.
   * Si no se pasa un nombre (`key`), se limpiará toda la cache.
   * @param key el nombre de la cache que quiero limpiar.
   */
  clear(key?: string): void {
    if (!key) {
      this.oCache = {};
    } else {
      this.oCache[key] = undefined;
      try {
        delete this.oCache[key];
      } catch (ex) {
        throw new Error(ex);
      }
    }
  }

  /**
   * Obtiene el objeto guardado para el nombre de cache (`key`)
   * pasado por parámetro.
   * @param key el nombre del objeto en cache que quiero obtener.
   */
  get<T>(key: string): Observable<T> {
    return this.oCache[key] ? this.oCache[key]() : of(null);
  }

  /**
   * Asigna un valor (`value`) con el nombre de cache (`key`)
   * pasado por parámetro.
   * @param key el nombre de la cache que quiero asignar.
   * @param value el valor que quiero guardar.
   */
  set(key: string, value: any): void {
    this.oCache[key] = () => of(value);
  }

  /**
   * Método para preguntar si hay un objecto asignado a ese nombre de cache (`key`).
   * @param key el nombre de la cache del cual quiero saber su existencia.
   */
  has(key): boolean {
    return this.oCache[key] !== null;
  }
}

/**
 * Utilidad para realizar multiples llamadas asincrónicas.
 *
 * Un Loader podrá registrar Observables y notificará a un objeto Notifiable 3 eventos 'wait', 'error' y 'resume'.
 * También indicará si hay alguna llamada en espera mediante el método 'isLoading'.
 * Ejecutará la función 'wait' cuando se registre el primer observable.
 * Ejecutará la función 'error' cuando se de un error.
 * Ejecutará la función 'resume' cuando todos los observables que se hayan registrado hayan finalizado (con o sin errores).
 *
 * Para registrar un observable se usa la función 'load'.
 *
 */
/* const loader = new Loader().notifyTo({
      wait: ()=>console.log('now I\'m waiting...'),
      resume: ()=>console.log('now I resume...')}
 );

 const observable = new Observable((observer)=>{
      observer.next("first observable");
      setTimeout(()=>{observer.complete()},3000); //Wait for 3 seconds
 });

 console.log(loader.isLoading())
 // > false

 loader.load(observable).subscribe((nextValue)=>console.log(nextValue));
 console.log("waiting: " , loader.isLoading());
 // > now I'm waiting...
 // > first observable
 // > waiting: true
 // After 3 seconds:
 // > now I resume...
 console.log("waiting: " , loader.isLoading());
 // > waiting: false
 */

export class Loader {
  /**
   * Objeto que guarda un registro y estado de todas las llamadas a observables
   * que se realicen con éste loader.
   */
  private registrations: {
    [key: string]: {
      /**
       * Bandera que indica que una llamada se esta cargando.
       */
      loading: boolean;
      /**
       * Bandera que indica que esa llamada termino con error.
       */
      error: boolean;
    };
  } = {};
  /**
   * Objeto a notificar, que enviará las distintas notificaciones a todos
   * los notificadores registrados.
   */
  private notifiable: Notifiable = {
    wait: () => {
      this.onNotification.next({ key: 'wait' });
    },
    resume: () => {
      this.onNotification.next({ key: 'resume' });
    },
    error: error => {
      this.onNotification.next({ key: 'error', params: [error] });
    },
  };
  /**
   * Subject al que se notificaran los eventos del Loader.
   */
  private onNotification: Subject<NotifiactionEvent> = new Subject();

  /**
   * Objeto que servirá de cache y sera instanciado al ser requerido.
   */
  private oCache: LoaderCache;
  /**
   * Memoria cache de este loader, usar para cargar observables cuya respuesta quiero guardar en cache.
   */
  get cache(): LoaderCache {
    if (!this.oCache) {
      this.oCache = new LoaderCache(this);
    }
    return this.oCache;
  }

  /**
   * Funcionalidad para marcar un token a estado cargando.
   * Si es la primer llamada, se notificará el `wait`.
   * @param token llave a ser marcada como "cargando" (`loading`)
   */
  private _wait(token: string): void {
    const isNotLoading = !this.isLoading(); // Guardo la respuesta de `isLoading` ya que
    this.registrations[token].loading = true; // de otra manera, devolvería siempre true a partir de acá.
    if (isNotLoading) {
      this._clearErrors();
      this.notifiable.wait();
    }
  }

  /**
   * Funcionalidad para marcar un token como finalizado correctamente.
   * Si es la última llamada, se notificará el `resume`.
   * @param token llave a ser anulada del registro.
   */
  private _resume(token: string): void {
    if (this._isLoading(token)) {
      if (!this.registrations[token].error) {
        this._unRegister(token);
      } else {
        this.registrations[token].loading = false;
      }
      // Si después de anular el registro del token, no se está
      // cargando mas nada, significa que ese fué el último token cargandose
      // por lo que notifico el `resume`.
      if (!this.isLoading()) {
        this.notifiable.resume();
      }
    }
  }

  /**
   * Funcionalidad para marcar un token como erroneo.
   * @param token llave en la que se registra el error
   * @param error el error capturado
   */
  private _error(token: string, error): void {
    this.registrations[token].error = true;
    this.notifiable.error(error);
  }

  /**
   * Funcionalidad para saber si un token esta siendo cargado.
   * @param token la llave que quiero saber si esta siendo cargada.
   */
  private _isLoading(token: string): boolean {
    return (
      this.registrations[token] !== null && this.registrations[token].loading
    );
  }

  /**
   * Anula la validez del token pasado por parámetro en el registro de observables.
   * @param token llave a ser anulada del registro de observables.
   */
  private _unRegister(token: string): void {
    this.registrations[token] = undefined;
    try {
      delete this.registrations[token];
    } catch (ex) {
      throw new Error(ex);
    }
  }

  /**
   * Crea un nuevo token y lo registra en el objecto de registros
   * de observables (`registrations`).
   * @returns el token generado.
   */
  private _register(): string {
    const token = `${new Date().getTime()}${Math.random()}`;
    this.registrations[token] = {
      loading: false,
      error: false,
    };
    return token;
  }

  /**
   * Limpia todos las registraciones en estado de error.
   */
  private _clearErrors(): void {
    Object.keys(this.registrations).forEach(token => {
      if (this.registrations[token].error) {
        this._unRegister(token);
      }
    });
  }

  /**
   * Devuelve un observable que recibe los eventos de wait, resume y error.
   */
  asObservable(): Observable<NotifiactionEvent> {
    return this.onNotification.asObservable();
  }

  /**
   * Subscribe un objeto `Notifiable`.
   * Este objeto será notificado ante los eventos del `Loader`.
   * @param notifiable el objeto al que el loader enviará notificaciones.
   */
  notifyTo(notifiable: Notifiable): Subscription {
    return this.onNotification.subscribe(({ key, params: args }) => {
      if (typeof notifiable[key] === 'function') {
        // eslint-disable-next-line
        notifiable[key].apply(notifiable, args);
      }
    });
  }

  /**
   * Devuelve `true` si alguno de todos los observables registrados
   * esta siendo cargado.
   */
  isLoading(): boolean {
    return Object.keys(this.registrations).some(token =>
      this._isLoading(token)
    );
  }

  /**
   * Devuelve `true` si alguno de todos los observables registrados
   * registró algún error en su respuesta.
   */
  hasError(): boolean {
    return Object.keys(this.registrations).some(
      token => this.registrations[token].error
    );
  }

  /**
   * Limpia todos los registros de observables (incluyendo los que estan en estado de error)
   * y notifica el evento `resume` de ser necesario.
   */
  clear(): this {
    const isLoading = this.isLoading();
    this.registrations = {};
    if (isLoading) {
      this.notifiable.resume();
    }
    return this;
  }

  /**
   * Registra un objeto observable. Si es el primero, se ejecutará la función 'wait' del
   * objeto Notifiable (si se registró alguno). Una vez que todos y cada uno de los observables terminen
   * de ejecutarse, se llamará a la función 'resume' del objeto Notifiable (si se registró alguno).
   *
   */
  load<T>(observable: Observable<T>): Observable<T> {
    const token = this._register();
    return concat(
      new Observable((subscriber: Subscriber<any>) => {
        this._wait(token);
        subscriber.complete();
      }),
      observable
    ).pipe(
      catchError(err => {
        this._error(token, err);
        throw err;
      }),
      finalize(() => {
        this._resume(token);
      })
    );
  }
}

/**
 * Abstracción que engloba a un cliente a ser utilizada para todas las llamadas al backend.
 */
export class Client {
  /**
   * Loader que será instanciado al ser requerido.
   */
  private oLoader: Loader;
  /**
   * Loader a ser utilizado para realizar todas las llamadas al backend.
   * Se instanciará la primera vez que sea requerido.
   */
  get loader(): Loader {
    if (!this.oLoader) {
      this.oLoader = new Loader();
    }
    return this.oLoader;
  }
}
