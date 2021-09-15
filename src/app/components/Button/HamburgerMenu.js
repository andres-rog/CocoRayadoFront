import React from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  IconButton,
  Image,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider
} from "@chakra-ui/react";
import logo from '../../assets/coconut.png';
import { SearchIcon,LockIcon,EditIcon,AddIcon,InfoIcon  } from '@chakra-ui/icons';
import {logoutEndpoint} from '../../services/apiRoutes';

function HamburgerMenu () {
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    function logout(){
        logoutEndpoint()
        .then(res=>{
            localStorage.setItem( "user",JSON.stringify(null) );
            history.push('/');
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    return (
        <>
            <Button
                as={IconButton}
                aria-label="Options"
                icon={<Image src={logo} w="100%" />}
                variant="outline"
                onClick={onOpen}
                ref={btnRef}

                position="absolute"
                top="5"
                left="10"
                width="70px"
                height="70px"
            />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Navega en CocoRayado</DrawerHeader>
                <Divider/>
                <DrawerBody>
                    <Button leftIcon={<SearchIcon />} fontSize="xl" variant="ghost" mr="{5}" mb={2} onClick={()=>{history.push('/dashboard')}}>
                        Explorar recetas.
                    </Button>
                    <Button leftIcon={<AddIcon />} fontSize="xl" variant="ghost" mr="{5}" mb={2} onClick={()=>{history.push('/createRecipe')}}>
                        Sube tu receta.
                    </Button>
                    <Button leftIcon={<InfoIcon />} fontSize="xl" variant="ghost" mr="{5}" mb={2} onClick={()=>{history.push('/contacto')}}>
                        Contacto.
                    </Button>
                    <Button leftIcon={<EditIcon />} fontSize="xl" variant="ghost" mr="{5}" mb={2} onClick={()=>{history.push('/edit')}}>
                        Edita tu perfil
                    </Button>
                    <Button leftIcon={<LockIcon />} fontSize="xl" variant="ghost" mr="{5}" mb={2} onClick={()=>{history.push('/changepassword')}}>
                        Cambia tu contraseña
                    </Button>
                </DrawerBody>
                <Divider/>
                <DrawerFooter>
                    <Button variant="ghost" mr="{5}" onClick={logout}>
                        Cerrar sesion
                    </Button>
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default HamburgerMenu;