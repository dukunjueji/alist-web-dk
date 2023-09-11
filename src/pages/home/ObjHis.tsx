import { useColorModeValue, VStack } from "@hope-ui/solid"
import { createSignal, createEffect } from "solid-js"

class get {}

// 匹配路径部分（不包括文件名）
const pathPattern = /(.+)\/([^/]+)$/

function extracted(settings: { times: {} }, setPlayHistory: get) {
  if (settings && settings.times) {
    const historyLinks = []
    for (const key in settings.times) {
      if (settings.times.hasOwnProperty(key)) {
        const videoPath = key
        const match = videoPath.match(pathPattern)
        // @ts-ignore
        const directory = match[1] // 第一个捕获组是路径部分
        // @ts-ignore
        const fileName = match[2] // 第二个捕获组是文件名部分
        // console.log("路径部分：" + directory);
        //console.log("文件名部分：" + fileName);
        // 使用 map 函数遍历 historyLinks 数组
        if (historyLinks.length == 0) {
          historyLinks.push({ videoPath })
        } else {
          let exist = false
          // 使用 for 循环遍历 historyLinks 数组
          for (let index = 0; index < historyLinks.length; index++) {
            const link = historyLinks[index]

            // @ts-ignore
            if (directory == link.videoPath.match(pathPattern)[1]) {
              exist = true
              // @ts-ignore
              link.videoPath = videoPath
              break
            }
          }
          if (!exist) {
            historyLinks.push({ videoPath })
          }
        }
      }
    }
    const historyLastLinks: any[] = []
    for (let index = 0; index < historyLinks.length; index++) {
      // @ts-ignore
      const videoPath = historyLinks[index].videoPath
      // 创建链接元素并添加到数组中

      historyLastLinks.push(
        <a class="hope-c-PJLV-ikoJJtX-css" href={videoPath}>
          {videoPath}
        </a>,
      )
    }
    // 倒序链接列表
    console.log("最后list " + JSON.stringify(historyLastLinks))

    // @ts-ignore
    setPlayHistory(historyLastLinks.slice().reverse())
  }
}

export const ObjHis = () => {
  const cardBg = useColorModeValue("white", "$neutral3")
  // 创建一个 Signal 来存储链接列表
  // 假设这是你的播放历史数据
  const [PlayHistory, setPlayHistory] = createSignal([])
  // 读取LocalStorage中的值并初始化播放历史
  const artplayerSettings = localStorage.getItem("artplayer_settings")
  let settings = { times: {} }
  if (artplayerSettings != null) {
    // 检查 artplayerSettings 是否已定义并且不为 null
    settings = JSON.parse(artplayerSettings)
  }

  // 初始化播放历史
  extracted(settings, setPlayHistory)

  // 使用 createEffect 每隔5秒更新播放历史
  createEffect(() => {
    const intervalId = setInterval(() => {
      const artplayerSettings = localStorage.getItem("artplayer_settings")
      let settings = { times: {} }
      if (artplayerSettings != null) {
        // 检查 artplayerSettings 是否已定义并且不为 null
        settings = JSON.parse(artplayerSettings)
      }
      // 更新播放历史
      extracted(settings, setPlayHistory)
    }, 5000) // 5000毫秒（5秒）执行一次操作

    // 在组件卸载时清除 interval
    return () => clearInterval(intervalId)
  })

  // 使用VStack渲染链接列表
  // @ts-ignore
  // @ts-ignore
  return (
    <VStack
      class="obj-box"
      w="$full"
      rounded="$xl"
      bgColor={cardBg()}
      p="$2"
      shadow="$lg"
      spacing="$4"
    >
      {PlayHistory().map((a) => (
        <div style="width: 100%; opacity: 1; --motion-scale: 1; transform: scale(var(--motion-scale));">
          <svg
            fill="currentColor"
            stroke-width="0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="icon hope-icon hope-c-XNyZK hope-c-PJLV hope-c-PJLV-idBSAKG-css"
          >
            <path d="M9.293 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4.707A1 1 0 0013.707 4L10 .293A1 1 0 009.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 01-1-1zM6 6.883a.5.5 0 01.757-.429l3.528 2.117a.5.5 0 010 .858l-3.528 2.117a.5.5 0 01-.757-.43V6.884z"></path>
          </svg>
          {a}
        </div>
      ))}
    </VStack>
  )
}