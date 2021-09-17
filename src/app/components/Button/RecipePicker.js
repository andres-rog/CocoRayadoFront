import React from "react";
import {
  Image,
  Badge,
  Box,
  LinkBox,
  LinkOverlay,
  Button,
  Flex,
  Divider
} from "@chakra-ui/react";
import {useHistory} from 'react-router-dom'
import Swal from 'sweetalert2';
import {removeFavoriteRecipe} from '../../services/apiRoutes';
import {deleteRecipe} from '../../services/apiRoutes';
import {useReducer} from 'react';


function RecipePicker({type="search", keyId="test", imageUrl="https://bit.ly/2Z4KKcF", steps=3, ingredients=2, title="Esta es mi receta con un titulo muy largo asdasasdasdas", date="88/88/8888", favorites=10, onUpdate=()=>{}}) {
    const history = useHistory();
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    function goToRecipe(){
      history.push(('/recipe/'+keyId));
    }

    function MouseOver() {
        const element = document.getElementById(keyId);
        element.style.opacity = 0.8;
    }
    function MouseOut(){
        const element = document.getElementById(keyId);
        element.style.opacity = 1;
    }

    function eliminarReceta(){
        Swal.fire({
            title: 'Cuidado',
            text: "¿Deseas eliminar permanentemente esta receta?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            confirmButtonText: '¡Si, eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "¿Estas seguro?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: "No",
                    confirmButtonText: '¡Si, estoy seguro!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        deleteRecipe({_id:keyId})
                        .then(()=>{
                            Swal.fire(
                                'Receta eliminada.',
                                'La receta ha sido removida.',
                                'success'
                              )
                              .then(()=>{
                                  onUpdate();
                                });
                        })
                        .catch(error=>{
                            console.log(error);
                            Swal.fire({
                                icon: 'error',
                                title: '¡Oh no! sucedió un error al eliminar la receta.',
                                text: ':c'
                            });
                        });
                    }
                })
            }
          })
    }

    function removerFavorito(){
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¿Deseas remover esta receta de tu lista de favoritos?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            confirmButtonText: '¡Si, remover!'
          }).then((result) => {
            if (result.isConfirmed) {
              removeFavoriteRecipe({_recipeId:keyId})
              .then(user=>{
                  localStorage.setItem("user",JSON.stringify(user.data.result));
                  Swal.fire(
                    'Receta removida de favoritos.',
                    'La receta ha sido removida.',
                    'success'
                  )
                  .then(()=>{
                    onUpdate();
                  });
              })
              .catch(error=>{
                  console.log(error);
                  Swal.fire({
                      icon: 'error',
                      title: 'Sucedio un error inesperado al remover esta receta en favoritos.',
                      showConfirmButton: false,
                      timer: 1500
                    })
              });
            }
          })
    }

    function editRecipe() {
      history.push(`/editrecipe/${keyId}`);
  }

    return (
      <Box width="400px" borderWidth="2px" borderRadius="lg" margin={4}>
        <LinkBox href="#" onMouseOver={MouseOver} onMouseOut={MouseOut} onClick={goToRecipe}>
            <LinkOverlay><Image id={keyId} src={imageUrl} width="100%" objectFit="cover"/></LinkOverlay>
            <Box p="6">
            <Box d="flex" alignItems="baseline">
                <Badge px="2">
                {date}
                </Badge>
                <Box
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
                >
                {steps} {steps > 1 ? "pasos" : "paso"} &bull; {ingredients} {ingredients > 1 ? "ingredientes" : "ingrediente"}
                </Box>
            </Box>
            <Box
                mt="1"
                fontWeight="semibold"
                fontSize="lg"
                lineHeight="tight"
                textAlign="left"
                isTruncated
            >
                {title}
            </Box>
            <Box d="flex" mt="2" alignItems="center">
                <Box as="span" fontSize="md">
                Favoritos: {favorites}
                </Box>
            </Box>
            </Box>
        </LinkBox>
        <Box>
            <Divider marginBottom="7px"/>
            <Flex
                display="flex"
                alignContent="center"
                alignItems="center"
                justifyContent="space-around"
                marginBottom="10px"
            >
                <Button display={type==="favorites" ? "inline" : "none"} colorScheme="red" width="200px" variant="ghost" onClick={removerFavorito}>Remover de favoritos</Button>
                <Button display={type==="recipes" ? "inline" : "none"} colorScheme="red" width="100px" variant="ghost" marginRight="10px" onClick={eliminarReceta}>ELIMINAR</Button>
                <Button display={type==="recipes" ? "inline" : "none"} colorScheme="teal" width="100px" variant="ghost" onClick={editRecipe}>Editar</Button>
            </Flex>
        </Box>

      </Box>
    )
}

export default RecipePicker;