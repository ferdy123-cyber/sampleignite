import { ApiResponse } from "apisauce"
import Toast from "../../components/Toast"
import { Toast as ToastNativeBAse } from "native-base"

export type GeneralApiProblem =
  /**
   * Times up.
   */
  | { kind: "timeout"; temporary: true }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: "cannot-connect"; temporary: true }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: "server" }
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: "unauthorized" }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: "forbidden" }
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: "not-found" }
  /**
   * All other 4xx series errors.
   */
  | { kind: "rejected" }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: "unknown"; temporary: true }
  /**
   * The data we received is not in the expected format.
   */
  | { kind: "bad-data" }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<any>) {
  if (!response.ok && response.data == "Token invalid") {
    return { kind: "Sesi telah berakhir" }
  }

  if (
    !response.ok &&
    response.data &&
    response.data.message &&
    response.data.message == "Refresh Token Invalid"
  ) {
    return { kind: "Sesi telah berakhir" }
  }

  if (!response.ok && response.data && response.data.message) {
    if (response.status !== 400) {
      if (response.data.code == "900902") {
        console.log("tendang ke login")
        return {
          kind: response.data.code ? response.data.code : "Unknown Error From Backend",
        }
      }
      if (response.data.code == "900901") {
        // console.log("melakukan refresh token")
        return {
          kind: response.data.code ? response.data.code : "Unknown Error From Backend",
        }
      }
      Toast({
        description: response.data.message ? response.data.message : "Unknown Error From Backend",
      })
      return { kind: response.data.message ? response.data.message : "Unknown Error From Backend" }
    } else if (response.status === 400) {
      Toast({ description: response.data.message })
      return { kind: response.data.message }
    } else {
      Toast({ description: "Unknown Error From Backend" })
      return { kind: "Unknown Error From Backend" }
    }
  }

  if (!response.ok && response.data && response.data.error) {
    if (response.status !== 400) {
      Toast({
        description: response.data.error ? response.data.error : "Unknown Error From Backend",
      })
      return { kind: response.data.error ? response.data.error : "Unknown Error From Backend" }
    } else if (response.status === 400) {
      Toast({ description: response.data.error })
      return { kind: response.data.error }
    } else {
      Toast({ description: "Unknown Error From Backend" })
      return { kind: "Unknown Error From Backend" }
    }
  }

  if (!response.ok && response.problem && response.problem === "TIMEOUT_ERROR") {
    Toast({ description: "Gagal Terkoneksi ke server, harap coba lagi" })
    return { kind: "Gagal Terkoneksi ke server, harap coba lagi" }
  }

  if (!response.ok && response.problem && response.problem === "NETWORK_ERROR") {
    Toast({ description: "Tidak dapat terhubung ke server" })
    ToastNativeBAse.closeAll()
    return { kind: "Tidak dapat terhubung ke server" }
  }

  if (!response.ok && response.problem && response.problem === "SERVER_ERROR") {
    Toast({ description: "Tidak dapat terhubung ke server" })
    ToastNativeBAse.closeAll()
    return { kind: "Tidak dapat terhubung ke server" }
  }

  Toast({ description: "Terjadi masalah di server" })
  return { kind: "Tidak dapat terhubung ke server" }
}
