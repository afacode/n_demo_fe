import { Notification } from 'electron'

export function showNotification(data: notificationOptions) {
  new Notification({ title: data.title, body: data.body }).show()
}

interface notificationOptions {
  title?: string
  subtitle?: string
  body?: string
  silent?: boolean
  icon?: string
  hasReply?: boolean
  timeoutType?: 'default' | 'never'
  /**
   * The placeholder to write in the inline reply input field.
   *
   * @platform darwin
   */
  replyPlaceholder?: string
  /**
   * The name of the sound file to play when the notification is shown.
   *
   * @platform darwin
   */
  sound?: string
  /**
   * The urgency level of the notification. Can be 'normal', 'critical', or 'low'.
   *
   * @platform linux
   */
  urgency?: 'normal' | 'critical' | 'low'
  /**
   * Actions to add to the notification. Please read the available actions and
   * limitations in the `NotificationAction` documentation.
   *
   * @platform darwin
   */
  actions?: NotificationAction[]
  /**
   * A custom title for the close button of an alert. An empty string will cause the
   * default localized text to be used.
   *
   * @platform darwin
   */
  closeButtonText?: string
  /**
   * A custom description of the Notification on Windows superseding all properties
   * above. Provides full customization of design and behavior of the notification.
   *
   * @platform win32
   */
  toastXml?: string
}
