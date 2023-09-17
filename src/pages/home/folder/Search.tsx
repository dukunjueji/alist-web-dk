import {
  Badge,
  createDisclosure,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  hope,
  UnorderedList,
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Button,
  Box,
} from "@hope-ui/solid"
import { BsSearch } from "solid-icons/bs"
import {
  createSignal,
  For,
  JSX,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js"
import Mark from "mark.js"
import {
  FullLoading,
  LinkWithBase,
  Paginator,
  SelectWrapper,
} from "~/components"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { getMainColor, me, password } from "~/store"
import { SearchNode } from "~/types"
import {
  bus,
  fsSearch,
  getFileSize,
  handleResp,
  hoverColor,
  pathJoin,
  r,
} from "~/utils"
import { isMac } from "~/utils/compatibility"
import { getIconByObj } from "~/utils/icon"
import { NavHis } from "../NavHis"
import { ObjHis } from "../ObjHis"
import { ListItem } from "./ListItem"
import { PPageResp, User } from "../../../types"

// class MarkKeywords {
//   root
//   rootHTML
//   style

//   /**
//    * Keyword highlight
//    * @param root Find root elements
//    * @param style The default background is highly bright yellow
//    */
//   constructor(config: { root: Element | null; style?: string }) {
//     if (!config.root) return
//     this.root = config.root
//     this.rootHTML = config.root.innerHTML
//     this.style = config.style ?? "background-color: #FF0"
//   }

//   /** mark keyword */
//   light(keyword: string) {
//     const handler = (root: any) => {
//       if (
//         root.nodeName === "#text" &&
//         root.parentNode.childNodes.length === 1
//       ) {
//         root.parentNode.innerHTML = root.parentNode.innerHTML.replace(
//           new RegExp(keyword, "g"),
//           `<span class="mark" style="${this.style}">${keyword}</span>`,
//         )
//       } else {
//         for (const node of root.childNodes) {
//           handler(node)
//         }
//       }
//     }

//     if (!this.root) return

//     // reset HTML
//     this.root.innerHTML = this.rootHTML!

//     if (!keyword) return
//     handler(this.root)
//   }
// }

function NodeName(props: { keywords: string; name: string }) {
  let ref: HTMLSpanElement
  onMount(() => {
    // const highlighter = new MarkKeywords({
    //   root: ref!,
    //   style: `background-color: var(--hope-colors-info5); border-radius: var(--hope-radii-md); margin: 0 1px; padding: 0 1px;`,
    // })
    // highlighter.light(props.keywords)
    const mark = new Mark(ref!)
    mark.mark(props.keywords, {
      separateWordSearch: true,
      diacritics: true,
    })
  })
  return (
    <hope.span
      ref={ref!}
      css={{
        mark: {
          bg: "$info4",
          rounded: "$md",
          px: "1px",
          // mx: "1px",
          color: "$info11",
          fontWeight: "$bold",
        },
      }}
    >
      {props.name}
    </hope.span>
  )
}

const SearchResult = (props: { node: SearchNode; keywords: string }) => {
  const { setPathAs } = usePath()
  return (
    <HStack
      w="$full"
      borderBottom={`1px solid ${hoverColor()}`}
      _hover={{
        bgColor: hoverColor(),
      }}
      rounded="$md"
      cursor="pointer"
      px="$2"
      as={LinkWithBase}
      href={props.node.path}
      encode
      onMouseEnter={() => {
        setPathAs(props.node.path, props.node.is_dir)
      }}
    >
      <Icon
        class="icon"
        boxSize="$6"
        color={getMainColor()}
        as={getIconByObj(props.node)}
        mr="$1"
      />
      <VStack flex={1} p="$1" spacing="$1" w="$full" alignItems="start">
        <Text
          css={{
            wordBreak: "break-all",
          }}
        >
          <NodeName keywords={props.keywords} name={props.node.name} />
          <Show when={props.node.size > 0 || !props.node.is_dir}>
            <Badge colorScheme="info" ml="$2">
              {getFileSize(props.node.size)}
            </Badge>
          </Show>
        </Text>
        <Text
          color="$neutral10"
          size="xs"
          css={{
            wordBreak: "break-all",
          }}
        >
          {props.node.parent}
        </Text>
      </VStack>
    </HStack>
  )
}
let tempList: []
const Search = () => {
  const [hotSearchRes, setHotSearchRes] = createSignal([])
  const pageSize = 100
  const { isOpen, onOpen, onClose, onToggle } = createDisclosure()
  const t = useT()
  const handler = (name: string) => {
    if (name === "search") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  const [loadingHot, hotSearch] = useFetch(
    (cat): PPageResp<any> => r.get("/public/hotSearch?cat=" + cat),
  )
  const getHotSearch = async (param: string) => {
    setHotSearchRes([])
    // 接受参数
    const resp = await hotSearch(param) // 传递参数
    if (loadingHot()) return
    handleResp(resp, (data) => {
      tempList = data.data
      setHotSearchRes(data.data)
      // for (const item of data.data) {
      //   // 处理数据
      //   console.log(item)
      // }
    })
  }
  if (tempList == null || tempList.length == 0) {
    getHotSearch("1")
  } else {
    setHotSearchRes(tempList)
  }

  function handleTagClick(linkText: any) {
    setKeywords(linkText)
    search()
  }

  const searchEvent = (e: KeyboardEvent) => {
    if ((e.ctrlKey || (isMac && e.metaKey)) && e.key.toLowerCase() === "k") {
      e.preventDefault()
      onToggle()
    }
  }
  document.addEventListener("keydown", searchEvent)
  onCleanup(() => {
    bus.off("tool", handler)
    document.removeEventListener("keydown", searchEvent)
  })
  const [keywords, setKeywords] = createSignal("")
  const { pathname } = useRouter()
  const [loading, searchReq] = useFetch(fsSearch)
  const [data, setData] = createSignal({
    content: [] as SearchNode[],
    total: 0,
  })
  const [scope, setScope] = createSignal(0)
  const scopes = ["all", "folder", "file"]
  let resetPaginator: () => void
  const search = async (page = 1) => {
    page === 1 && resetPaginator?.()
    if (loading()) return
    setData({
      content: [],
      total: 0,
    })
    const resp = await searchReq(
      pathname(),
      keywords(),
      password(),
      scope(),
      page,
      pageSize,
    )
    handleResp(resp, (data) => {
      const content = data.content
      if (!content) {
        return
      }
      content.forEach((node) => {
        if (me().base_path && node.parent.startsWith(me().base_path)) {
          const pattern = new RegExp("^" + me().base_path)
          node.parent = node.parent.replace(pattern, "") || "/"
          if (!node.parent.startsWith("/")) {
            node.parent = "/" + node.parent
          }
        }
        node.path = pathJoin(node.parent, node.name)
      })
      setData(data)
    })
  }
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <Modal
      // blockScrollOnMount={false}
      opened={isOpen()}
      onClose={onClose}
      closeOnEsc={false}
      size={{
        "@initial": "sm",
        "@sm": "lg",
        "@md": "2xl",
      }}
      initialFocus="#search-input"
      scrollBehavior="inside"
    >
      <ModalOverlay
        bg="$blackAlpha5"
        css={{
          backdropFilter: "blur(10px) hue-rotate(90deg)",
        }}
      />
      <ModalContent mx="$1">
        <ModalCloseButton />
        <ModalHeader>
          <a style={{ color: "blue" }}>近期热门</a>
        </ModalHeader>
        <ModalBody>
          <HStack spacing="$2">
            <Button
              size="sm"
              colorScheme="primary"
              onClick={() => getHotSearch("3")}
            >
              电视剧
            </Button>
            <Button
              size="sm"
              colorScheme="accent"
              onClick={() => getHotSearch("2")}
            >
              电影
            </Button>
            <Button
              size="sm"
              colorScheme="neutral"
              onClick={() => getHotSearch("4")}
            >
              综艺
            </Button>
            <Button
              size="sm"
              colorScheme="success"
              onClick={() => getHotSearch("5")}
            >
              动漫
            </Button>
            <Button
              size="sm"
              colorScheme="info"
              onClick={() => getHotSearch("6")}
            >
              儿童
            </Button>
          </HStack>
          <ModalBody></ModalBody>
          <Switch>
            <Match when={loadingHot()}>
              <FullLoading />
            </Match>
          </Switch>
          <For each={hotSearchRes()}>
            {(obj, i) => {
              // @ts-ignore
              if (i() < 15) {
                return (
                  <Tag
                    variant="dot"
                    colorScheme="accent"
                    onClick={() => handleTagClick(obj.title)}
                  >
                    {obj.title} {obj.upinfo}
                  </Tag>
                )
              }
            }}
          </For>
          <ModalBody></ModalBody>
          <VStack w="$full" spacing="$2">
            <HStack w="$full" spacing="$2">
              <SelectWrapper
                w="$32"
                value={scope()}
                onChange={(v) => setScope(v)}
                options={scopes.map((v, i) => ({
                  value: i,
                  label: t(`home.search.scopes.${v}`),
                }))}
              />
              <Input
                id="search-input"
                value={keywords()}
                onInput={(e) => {
                  setKeywords(e.currentTarget.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && keywords().length !== 0) {
                    search()
                  }
                }}
              />
              <IconButton
                flexShrink={0}
                aria-label="search"
                icon={<BsSearch />}
                onClick={() => search()}
                loading={loading()}
                disabled={keywords().length === 0}
              />
            </HStack>
            <Switch>
              <Match when={loading()}>
                <FullLoading />
              </Match>
              <Match when={data().content.length === 0}>
                <Text size="2xl" my="$8">
                  {t("home.search.no_result")}
                </Text>
              </Match>
            </Switch>
            <VStack w="$full">
              <For each={data().content}>
                {(item) => <SearchResult node={item} keywords={keywords()} />}
              </For>
            </VStack>
            <Paginator
              total={data().total}
              defaultPageSize={pageSize}
              onChange={(page) => {
                search(page)
              }}
              setResetCallback={(reset) => (resetPaginator = reset)}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export { Search }
