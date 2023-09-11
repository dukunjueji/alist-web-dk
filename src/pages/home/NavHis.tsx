import { Breadcrumb } from "@hope-ui/solid"
import { usePath, useRouter, useT } from "~/hooks"
import { getSetting } from "~/store"

export const NavHis = () => {
  const { pathname } = useRouter()
  return (
    <Breadcrumb class="nav" w="$full">
      {getSetting("home_icon") + "播放历史"}
    </Breadcrumb>
  )
}
