import React from "react";
import { useHistory } from "react-router-dom";
import {
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  IconButton,
  Image
} from "@chakra-ui/react";
import logo from '../../assets/coconut.png';
import { SearchIcon,StarIcon,EditIcon,AddIcon,CloseIcon  } from '@chakra-ui/icons';


function HamburgerMenu () {
    const history = useHistory();

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<Image src={logo} w="100%" />}
                variant="outline"

                position="absolute"
                top="5"
                left="10"
                width="70px"
                height="70px"
            />
            <MenuList>
                <MenuItem icon={<SearchIcon />} onClick={()=>history.push('/dashboard')}>
                Busca nuevas recetas
                </MenuItem>
                <MenuItem icon={<StarIcon />} onClick={()=>history.push(`myrecipes/favorites`)}>
                Ver tus favoritos
                </MenuItem>
                <MenuItem icon={<EditIcon />} onClick={()=>history.push(`myrecipes/recipes`)}>
                Ver tus recetas
                </MenuItem>
                <MenuItem icon={<AddIcon />} onClick={()=>history.push(`createrecipe`)}>
                Crear receta
                </MenuItem>
                <MenuItem icon={<EditIcon />} onClick={()=>history.push(`editprofile`)}>
                Editar perfil
                </MenuItem>
                <MenuItem icon={<CloseIcon />}>
                Cerrar sesion
                </MenuItem>
            </MenuList>
        </Menu>
    );
}

export default HamburgerMenu;