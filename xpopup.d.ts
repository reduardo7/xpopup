export interface IXPopupParams {
  /**
   * URL to load in Popup.
   */
  url?: string;

  /**
   * URL params.
   *
   * If `url` is not used, this option is not used.
   */
  data?: any;

  /**
   * Window name.
   */
  name?: string;

  /**
   * Open PopUp as full screen?
   *
   * @default false
   */
  fullscreen: boolean;

  /**
   * Show toolbar in Popup?
   *
   * @default false
   */
  toolbar?: boolean;

  /**
   * Lock location bar?
   *
   * @default false
   */
  location?: boolean;

  /**
   * Text in status bar.
   *
   * @default ''
   */
  status?: string;

  /**
   * Show menu bar?
   *
   * @default false
   */
  menubar?: boolean;

  /**
   * Show scroll bars?
   *
   * @default true
   */
  scrollbars?: boolean;

  /**
   * Allow resize window?
   *
   * @default true
   */
  resizable?: boolean;

  /**
   * Window width.
   *
   * @default 500
   */
  width?: number;

  /**
   * Window height.
   *
   * @default 400
   */
  height?: number;

  /**
   * Window left position.
   *
   * Overwrites {@link center} option.
   *
   * @see center
   */
  left?: number;

  /**
   * Window top position.
   *
   * Overwrites {@link center} option.
   *
   * @see center
   */
  top?: number;

  /**
   * Center window in screen?
   *
   * @default true
   */
  center?: boolean;

  /**
   * Set Popup position.
   *
   * Format: `[parent] [position]`
   *   - `[parent]`: 'screen' | 'window' (Default: 'window').
   *   - `[position]`: 'top' | 'left' | 'bottom' | 'right' | 'middle' (Y) | 'center' (X).
   *
   * @default ''
   */
  position?: string;

  /**
   * Close opened Popup on parent unload/close event?
   *
   * @default false
   */
  closeOnParentUnload?: boolean;

  /**
   * Auto set focus and block UI?
   *
   * @default false
   */
  modal?: boolean;

  /**
   * Callback function on close window event.
   */
  onClose?: () => void | Promise<void>;

  /**
   * Callback function on open.
   */
  onOpen?: () => void | Promise<void>;

  /**
   * Callback function on error (Popup's blocked).
   */
  onError?: () => void | Promise<void>;

  /**
   * Auto open Popup?
   *
   * @default true
   */
  autoOpen?: boolean;
}

export interface IXPopupInstance {
  /**
   * Opened Popup window object.
   *
   * @readonly
   */
  win: Window;

  /**
   * Close Popup.
   *
   * @returns This instance.
   */
  close: () => IXPopupInstance;

  /**
   * Center Popup on the screen.
   *
   * @returns Returns `false` on error.
   */
  center: () => boolean;

  /**
   * Maximize Popup.
   *
   * @returns Returns `false` on error.
   */
  maximize: () => boolean;

  /**
   * Focus on Popup window.
   *
   * @returns This instance.
   */
  focus: () => IXPopupInstance;

  /**
   * @returns Returns `true` if Popup window is closed.
   */
  closed: () => boolean;
}

/**
 * Open a Popup Window.
 *
 * @param  p Options.
 * @returns
 * @see https://github.com/reduardo7/xpopup
 * @copyright
 * Copyright (c) 2021 XPOPUP | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 * @author Eduardo Daniel Cuomo
 * @public
 * @readonly
 */
export declare function xpopup(p: IXPopupParams): IXPopupInstance;
