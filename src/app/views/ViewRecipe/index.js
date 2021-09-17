import React from "react";

import {Box, Text, useColorMode, Divider, Image, UnorderedList, ListItem, Stack, Icon, Button, Spinner } from "@chakra-ui/react";
import { ChevronRightIcon,SmallAddIcon} from '@chakra-ui/icons';
import ToggleColor from '../../components/Button/ToggleColor';
import HamburgerMenu from '../../components/Button/HamburgerMenu';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Swal from 'sweetalert2';
import {findRecipe} from '../../services/apiRoutes';
import {addFavoriteRecipe} from '../../services/apiRoutes';
import {removeFavoriteRecipe} from '../../services/apiRoutes';
import {deleteRecipe} from '../../services/apiRoutes';

export default function ViewRecipe({history}) {
    const [buttonsStatus, setButtonsStatus] = useState({
        deleteRecipe:false,
        addFavorite:false,
        deleteFavorite:false,
        editRecipe:false
    });
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState({});
    const [recipeData, setRecipeData] = useState({
        tags: [],
        ingredients: [],
        title: "",
        description: "",
        thumbnail: "",
        servingsAmount: "",
        ingredientsAmount: "",
        caloriesPerServing: "",
        step:[]
    });
    const {colorMode} = useColorMode();
    const { id } = useParams();

    async function getInitData(_id){
        const findRecipePromise = () => findRecipe({_id});
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
        await findRecipePromise()
            .then(res=>{
                setRecipeData(res.data.recipe);
                getButtonStatus(userData, res.data.recipe);
                setLoaded(true);
            })
            .catch(err=>{
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: '¡Oh no! sucedió un error al buscar la receta.',
                    text: ':c'
                })
                .then(()=>{
                    history.push('/dashboard');
                })
            })
    }

    function getButtonStatus(userData, recipe) {
        if(userData) {
            const buttons = buttonsStatus;
            if(userData._id === recipe._owner) {
                buttons.deleteRecipe=true;
                buttons.editRecipe=true;
            }
            else {
                buttons.deleteRecipe=false;
                buttons.editRecipe=false;
            }

            if(userData._favoritos.includes(recipe._id)) {
                setButtonsStatus(prevState => {
                    return {...prevState,
                    deleteFavorite:true,
                    addFavorite:false
                    }
                })
            }
            else {
                setButtonsStatus(prevState => {
                    return {...prevState,
                    deleteFavorite:false,
                    addFavorite:true
                    }
                })
            }
        }
    }

    useEffect(() => {
        if(!loaded) {
            getInitData(id);
        }
    },[]);

    function addFavorite(){
        addFavoriteRecipe({_recipeId:recipeData._id})
        .then(user=>{
            localStorage.setItem("user",JSON.stringify(user.data.result));
            const userData = JSON.parse(localStorage.getItem("user"));
            setUser(userData);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Receta guardada en favoritos.',
                showConfirmButton: false,
                timer: 1500
              })
              .then(()=>{
                getButtonStatus(userData,recipeData);
              })
        })
        .catch(error=>{
            console.log(error);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Sucedio un error inesperado al guardar esta receta en favoritos.',
                showConfirmButton: false,
                timer: 1500
              })
        })
    }

    function deleteFavorite(){
        removeFavoriteRecipe({_recipeId:recipeData._id})
        .then(user=>{
            localStorage.setItem("user",JSON.stringify(user.data.result));
            const userData = JSON.parse(localStorage.getItem("user"));
            setUser(userData);
            Swal.fire({
                position: 'top-end',
                icon: 'info',
            title: 'Receta removida de favoritos.',
                showConfirmButton: false,
                timer: 1500
              })
              .then(()=>{
                getButtonStatus(userData,recipeData);
              })
        })
        .catch(error=>{
            console.log(error);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Sucedio un error inesperado al remover esta receta en favoritos.',
                showConfirmButton: false,
                timer: 1500
              })
        })
    }

    function eliminarReceta(){
        Swal.fire({
            title: '¡Cuidado!',
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
                    title: "Estás seguro?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: "No",
                    confirmButtonText: '¡Si, estoy seguro!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const deleteRecipePromise = deleteRecipe({_id:recipeData._id});
                      deleteRecipePromise()
                        .then(()=>{
                            Swal.fire(
                                'Receta eliminada.',
                                'La receta ha sido removida.',
                                'success'
                              )
                              .then(()=>{
                                history.push('/dashboard');
                                });
                        })
                        .catch(error=>{
                            console.log(error);
                            Swal.fire({
                                icon: 'error',
                                title: '¡Oh no! sucedió un error al eliminar la receta.',
                                text: ':c'
                            });
                        })
                    }
                })
            }
          })
    }

    function editRecipe() {
        history.push(`/editrecipe/${recipeData._id}`);
    }

    function showButtons() {
        return(
            <Box>
                {buttonsStatus.deleteRecipe ? <Button marginRight="20px" width="250px" height="50px" colorScheme="red" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={eliminarReceta}>ELIMINAR RECETA</Button> : null}
                {buttonsStatus.deleteFavorite ? <Button marginRight="20px" width="310px" height="50px" colorScheme="red" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={deleteFavorite}>Remover receta de favoritos</Button> : null}
                {buttonsStatus.addFavorite ? <Button marginRight="20px" width="250px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={addFavorite}>Agregar a favoritos</Button> : null}
                {buttonsStatus.editRecipe ? <Button display={buttonsStatus.editRecipe} width="250px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={editRecipe}>Editar receta</Button> : null}
            </Box>
        )
    }

    function recipe() {
        return (
            <Box>
                <Box display="flex" flexDir="column">
                    <Image border="solid" borderWidth="3px" margin="0 auto" width="50%" height="500px" objectFit="cover" src={recipeData.thumbnail}/>
                    <Text marginTop="10px" marginBottom="10px" fontSize="2xl" fontWeight="500" textAlign="center">{recipeData.description}</Text>
                    <Box
                        width="90%"
                        borderRadius="5"
                        borderWidth={1}
                        borderColor={(colorMode === "light") ? "#333" : "#fff"}
                        backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}
                        margin="0 auto"
                        marginBottom="30px"
                    >
                        <UnorderedList marginLeft="5%" marginTop="10px" marginBottom="10px" fontSize="xl" fontWeight="500" spacing={3}>
                            <ListItem>Categorias: {recipeData.tags.join(", ")}</ListItem>
                            <ListItem>Ingredientes principales: {recipeData.ingredients.join(", ")}</ListItem>
                            <ListItem>Cantidad de ingredientes: {recipeData.ingredientsAmount}</ListItem>
                            <ListItem>Calorias por porcion: {recipeData.caloriesPerServing}</ListItem>
                            <ListItem>Cantidad de porciones: {recipeData.servingsAmount}</ListItem>
                        </UnorderedList>
                    </Box>
                </Box>
                <Divider marginTop={5} marginBottom={5}/>
                <Box display="flex" flexDir="column">
                    <Text marginTop="10px" marginBottom="10px" fontSize="3xl" fontWeight="500" textAlign="center">Instrucciones:</Text>
                    <Box
                        width="90%"
                        borderRadius="5"
                        borderWidth={1}
                        borderColor={(colorMode === "light") ? "#333" : "#fff"}
                        backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}
                        margin="0 auto"
                        marginBottom="30px"
                    >
                        <Stack width="90%" margin="0 auto" marginTop="10px" marginBottom="10px" fontSize="xl" spacing={3}>
                            {
                                recipeData.step.map((element, index)=>(
                                    <Box>
                                        <Stack spacing={2}>
                                            <Text textAlign="left" fontSize="2xl" fontWeight="500"><Icon as={ChevronRightIcon}/>Paso {index+1}</Text>
                                            <Text textAlign="left" marginLeft="5%"><Icon as={SmallAddIcon}/>{element.description}</Text>
                                            <Box display="flex" justifyContent="center" >
                                                <Image objectFit="cover" margin={2} width={element.img ? "50%" : "0"} height={element.img ? "400px" : "0"} src={element.img ? element.img : ""}/>
                                            </Box>
                                        </Stack>
                                        <Divider/>
                                    </Box>
                                ))
                            }
                        </Stack>
                    </Box>
                    <Box marginBottom={3}>
                            {showButtons()}
                    </Box>
                </Box>
            </Box>
        )
    }

    function loading(){
        return(
            <Spinner size="xl" />
        )
    }

    return (
        <Box bgGradient={(colorMode === "dark") ? "linear(to-tl,#070a0d, #121921, #0f0613)" : "linear(to-tl,#99e5f6 , #28b5d8)"} minWidth="100vw" minHeight="100vh">
            <Box
                display="flex"
                flexDir="column"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
            >
                <ToggleColor/>
                <HamburgerMenu/>
                <Text fontSize="4xl" fontWeight="500" margin={4}>{loaded ? recipeData.title : "Receta"}</Text>
            </Box>
            <Divider marginTop={5} marginBottom={5}/>
            {loaded ? recipe() : loading()}
        </Box>
    )
}