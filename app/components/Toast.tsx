import { Toast as ToastComponent } from "native-base"
import fonts from "../theme/fonts"
import { colors, metrics } from "../theme"

export interface ToastProps {
  /**
   * An optional style override useful for padding & margin.
   */
  description: string
  duration?: number
}

/**
 * Describe your component here
 */
const Toast = function Toast(props: ToastProps) {
  const { description, duration } = props
  ToastComponent.closeAll()
  ToastComponent.show({
    duration: duration ? duration : 3500,
    placement: "top",
    description: description,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingY: 2,
    paddingX: 4,
    maxWidth: metrics.screenWidth - 30,
    fontWeight: "bold",
    _description: {
      color: colors.white,
      fontFamily: fonts.type.bold,
      fontSize: 12,
    },
  })
}

export default Toast
