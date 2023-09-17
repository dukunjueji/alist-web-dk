import {
  HStack,
  useColorModeValue,
  Image,
  Center,
  Icon,
  Kbd,
  Stack,
  Box,
  VStack,
  AspectRatio,
  Badge,
  Grid,
  Button,
} from "@hope-ui/solid"
import { For, Show } from "solid-js"
import { getSetting, objStore, State } from "~/store"
import { BsSearch } from "solid-icons/bs"
import { CenterLoading } from "~/components"
import { Container } from "../Container"
import { bus } from "~/utils"
import { Layout } from "./layout"
import { isMac } from "~/utils/compatibility"

export const Header = () => {
  const logos = getSetting("logo").split("\n")
  const logo = useColorModeValue(logos[0], logos.pop())
  const property = {
    imageUrl: "https://p0.qhimg.com/d/dy_1945f270c2178d822415754016ed1b94.jpg",
    imageAlt: "",
    beds: 1,
    baths: 1,
    title: "wqewqe",
    formattedPrice: "$1,900.00",
    reviewCount: 34,
    rating: 4,
  }
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <Center
      class="header"
      w="$full"
      // shadow="$md"
    >
      <Container>
        {/*<HStack px="calc(2% + 0.5rem)"*/}
        {/*        py="$2"*/}
        {/*        w="$full" overflowX="auto" spacing="$4">*/}
        {/*  <Button colorScheme="primary">Button 1</Button>*/}
        {/*  <Button colorScheme="accent">Button 2</Button>*/}
        {/*  <Button colorScheme="neutral">Button 3</Button>*/}
        {/*  <Button colorScheme="success">Button 4</Button>*/}
        {/*  <Button colorScheme="info">Button 5</Button>*/}
        {/*  <Button colorScheme="warning">Button 6</Button>*/}
        {/*  <Button colorScheme="danger">Button 7</Button>*/}
        {/*  <Button colorScheme="warning">Button 6</Button>*/}
        {/*  <Button colorScheme="danger">Button 7</Button>*/}
        {/*  <Button colorScheme="warning">Button 6</Button>*/}
        {/*  <Button colorScheme="danger">Button 7</Button>*/}
        {/*  /!* Add more buttons as needed *!/*/}
        {/*</HStack>*/}

        <HStack
          px="calc(2% + 0.5rem)"
          py="$2"
          w="$full"
          justifyContent="space-between"
        >
          <HStack class="header-left" h="44px">
            <Image
              src={logo()!}
              h="$full"
              w="auto"
              fallback={<CenterLoading />}
            />
          </HStack>
          <HStack class="header-right" spacing="$2">
            <Show when={objStore.state === State.Folder}>
              <Show when={getSetting("search_index") !== "none"}>
                <HStack
                  bg="$neutral4"
                  w="$32"
                  p="$2"
                  rounded="$md"
                  justifyContent="space-between"
                  border="2px solid transparent"
                  cursor="pointer"
                  _hover={{
                    borderColor: "$info6",
                  }}
                  onClick={() => {
                    bus.emit("tool", "search")
                  }}
                >
                  <Icon as={BsSearch} />
                  <HStack>
                    {isMac ? <Kbd>Cmd</Kbd> : <Kbd>Ctrl</Kbd>}
                    <Kbd>K</Kbd>
                  </HStack>
                </HStack>
              </Show>
              <Layout />
            </Show>
          </HStack>
        </HStack>
        {/*<HStack  px="calc(2% + 0.5rem)"*/}
        {/*         py="$2"*/}
        {/*         w="$full"*/}
        {/*         overflowX="scroll"*/}

        {/*         spacing="43px">*/}
        {/*  <Box*/}
        {/*      maxW="$sm"*/}
        {/*      borderWidth="1px"*/}
        {/*      borderColor="$neutral6"*/}
        {/*      borderRadius="$lg"*/}
        {/*      overflow="hidden"*/}
        {/*  >*/}
        {/*    <Box as="img" src={property.imageUrl} alt={property.imageAlt} />*/}
        {/*    <Box p="$2">*/}
        {/*      <Box mt="$1" textAlign='center' fontWeight="$semibold" as="h4">*/}
        {/*        云之羽*/}
        {/*      </Box>*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*  <Box*/}
        {/*      maxW="$sm"*/}
        {/*      borderWidth="1px"*/}
        {/*      borderColor="$neutral6"*/}
        {/*      borderRadius="$lg"*/}
        {/*      overflow="hidden"*/}
        {/*  >*/}
        {/*    <Box as="img" src='https://p6.qhimg.com/d/dy_fc7282fed5941d526340232701fe46ee.jpg' alt={property.imageAlt} />*/}
        {/*    <Box p="$2">*/}
        {/*      <Box mt="$1" textAlign='center' fontWeight="$semibold" as="h6">*/}
        {/*        汪汪队立大功*/}
        {/*      </Box>*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*  <Box*/}
        {/*      maxW="$sm"*/}
        {/*      borderWidth="1px"*/}
        {/*      borderColor="$neutral6"*/}
        {/*      borderRadius="$lg"*/}
        {/*      overflow="hidden"*/}
        {/*  >*/}
        {/*    <Box as="img" src='https://p6.qhimg.com/d/dy_fc7282fed5941d526340232701fe46ee.jpg' alt={property.imageAlt} />*/}
        {/*    <Box p="$2">*/}
        {/*      <Box mt="$1" textAlign='center' fontWeight="$semibold" as="h6">*/}
        {/*        汪汪队立大功*/}
        {/*      </Box>*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*  <Box*/}
        {/*      maxW="$sm"*/}
        {/*      borderWidth="1px"*/}
        {/*      borderColor="$neutral6"*/}
        {/*      borderRadius="$lg"*/}
        {/*      overflow="hidden"*/}
        {/*  >*/}
        {/*    <Box as="img" src='https://p6.qhimg.com/d/dy_fc7282fed5941d526340232701fe46ee.jpg' alt={property.imageAlt} />*/}
        {/*    <Box p="$2">*/}
        {/*      <Box mt="$1" textAlign='center' fontWeight="$semibold" as="h6">*/}
        {/*        汪汪队立大功*/}
        {/*      </Box>*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*  <Box*/}
        {/*      maxW="$sm"*/}
        {/*      borderWidth="1px"*/}
        {/*      borderColor="$neutral6"*/}
        {/*      borderRadius="$lg"*/}
        {/*      overflow="hidden"*/}
        {/*  >*/}
        {/*    <Box as="img" src='https://p6.qhimg.com/d/dy_fc7282fed5941d526340232701fe46ee.jpg' alt={property.imageAlt} />*/}
        {/*    <Box p="$2">*/}
        {/*      <Box mt="$1" textAlign='center' fontWeight="$semibold" as="h6">*/}
        {/*        汪汪队立大功*/}
        {/*      </Box>*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*</HStack>*/}
      </Container>
    </Center>
  )
}
