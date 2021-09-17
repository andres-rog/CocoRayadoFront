import React from "react";
import {useParams} from 'react-router-dom';
import {Box, Text, Input, FormControl, FormLabel, useColorMode, Button, Divider, Textarea, FormErrorMessage,
        NumberInput, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper, NumberInputField, HStack,
        Tooltip, Image, Stack} from "@chakra-ui/react";
import { QuestionIcon } from '@chakra-ui/icons';
import { useForm, Controller } from "react-hook-form";
import ToggleColor from '../../components/Button/ToggleColor';
import HamburgerMenu from '../../components/Button/HamburgerMenu';
import ImageUpload from '../../components/Container/ImageUpload';
import RecipeStepContainer from '../../components/Container/RecipeStepContainer'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import {useState, useEffect, useReducer} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';
import {findRecipe} from '../../services/apiRoutes';
import {categorias, ingredientes} from '../../assets/data.json';
import { editRecipe } from "../../services/apiRoutes";

const schema = yup.object().shape({
  title: yup.string().min(5,'El titulo es muy corto.'),
  description: yup.string().min(30,'La descripcion es muy corta.').max(200,'La descripcion es demaciado larga.'),
  ingredientsQuantity: yup.number().min(1).max(99),
  ingredients: yup.array().min(1,'Debes agregar por lo menos un ingrediente principal').max(5,'No puedes elegir mas de 5 ingredientes principales.'),
  tags: yup.array().min(1,'Debes elegir por lo menos una categoria').max(3,'No puedes elegir mas de 3 categorias.')
});

const animatedComponents = makeAnimated();
let stepsData = [{description:'', imageSrc:null}];
let categoriaError=false;
let ingredientsError=false;

let categoriasValues = [];
let ingredientesPrincipalesValues = [];

let newData = {};

export default function EditRecipe({history}) {
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);
    const [recipeData, setRecipeData] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState({});
    const [stepsDisable, setStepsDisable] = useState(false);
    const {colorMode} = useColorMode();
    const { id } = useParams();
    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    function addNewStep() {
        stepsData = [...stepsData,{image:null,description:null}];
        setStepsDisable(true);
    }

    function deleteStep() {
        stepsData.pop();
        setStepsDisable(false);
        forceUpdate();
    }

    function submitStatusCheck(){
        categoriaError = (newData.tags.length>3 || newData.tags.length<1);
        ingredientsError = (newData.ingredients.length>5 || newData.ingredients.length<1);
        setStepsDisable(categoriaError || ingredientsError);
    }

    function handleStepData(e) {
        stepsData[e.step]={img:e.imageSrc,description:e.description};
        let disable=false;
        stepsData.map((element)=>{
            if(element.description.length>500 || element.description.length<20 || ingredientsError || categoriaError) disable=true;
        });
        setStepsDisable(disable);
    }

    function handleCategory(e) {
        let categorias =  [];
        e.map(element=>{
            categorias.push(element.value);
        })
        newData.tags=categorias;
        submitStatusCheck();
    }

    function handleIngredient(e) {
        let ingredients = [];
        e.map(element=>{
            ingredients.push(element.value);
        })
        newData.ingredients=ingredients;
        submitStatusCheck();
    }

    function handleIngredientsAmount(e){
        newData.ingredientsAmount=e;
    }
    function handlePortionsAmount(e){
        newData.servingsAmount=e;
    }
    function handleCaloriesAmount(e){
        newData.caloriesPerServing=e;
    }

    function submitRecipe(values){
        newData.title=values.title;
        newData.description=values.description;
        newData.step=stepsData;

        Swal.fire({
            title: '¿Deseas actualizar la receta con estas opciones?',
            showDenyButton: true,
            confirmButtonText: `¡Si, actualizar!`,
            denyButtonText: `¡Aun no!`,
            showLoaderOnConfirm: true,
        })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Actualizando tu receta',
                    html: 'Por favor espera…',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                        editRecipe(newData)
                            .then(()=>{
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡La receta se actualizó exitosamente!'
                                }).then(()=>{
                                    history.push('/dashboard');
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                Swal.fire({
                                    icon: 'error',
                                    title: '¡Oh no! sucedió un error inesperado.',
                                    text: ':c'
                                });
                            })

                    }
                })
            }
        })
    }

    function getDataInit() {
        categoriasValues=[];
        ingredientesPrincipalesValues=[];
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
        findRecipe({_id:id,_owner:userData._id})
        .then(res=>{
            if(res.data.recipe !== null) {
                const getSteps = [];
                res.data.recipe.step.map((element,index)=>{
                    getSteps.push({step:index+1, description: element.description, img: element.img});
                })
                stepsData = getSteps;

                res.data.recipe.tags.map(element=>{
                    categoriasValues.push({"value":element, "label":element})
                })

                res.data.recipe.ingredients.map(element=>{
                    ingredientesPrincipalesValues.push({"value":element, "label":element})
                })

                newData = {
                    _id:res.data.recipe._id,
                    title:res.data.recipe.title,
                    description:res.data.recipe.description,
                    tags:res.data.recipe.tags,
                    ingredients:res.data.recipe.ingredients,
                    ingredientsAmount:res.data.recipe.ingredientsAmount,
                    servingsAmount:res.data.recipe.servingsAmount,
                    caloriesPerServing:res.data.recipe.caloriesPerServing,
                    thumbnail:res.data.recipe.thumbnail,
                    step:res.data.recipe.step
                }

                setRecipeData(res.data.recipe);
                setLoaded(true);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Oh no! sucedió un error al buscar la receta.',
                    text: ':c'
                })
                .then(()=>{
                    history.push('/dashboard');
                })
            }
        })
        .catch(err=>{
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

    useEffect(() => {
        if(!loaded) {
            const userData = JSON.parse(localStorage.getItem("user"));
            if(userData === null || userData===undefined){
                history.push('/')
            }
            else {
                getDataInit();
            }
        }
    },[]);

    function recipeEditView(){
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
                    <Text fontSize="4xl" fontWeight="500" margin={4}>Editar receta</Text>
                </Box>
                <Divider marginTop={5} marginBottom={5}/>
                <Box display="flex" flexDir="column">
                    <HStack marginLeft="5%" marginBottom="5px">
                        <Image src="https://cdn-icons-png.flaticon.com/512/179/179349.png" width="30px"></Image>
                        <Text textAlign="left" fontSize="xl" fontWeight="500">Informacion basica:</Text>
                    </HStack>
                    <Box
                        width="90%"
                        borderRadius="5"
                        borderWidth={1}
                        borderColor={(colorMode === "light") ? "#333" : "#fff"}
                        backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.12)"}
                        margin="0 auto"
                        marginBottom="30px"
    
                        display="flex"
                        flexDir="column"
                    >
                        <form onSubmit={handleSubmit(submitRecipe)}>
                            <FormControl isInvalid={errors.title} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Nombre de la receta:</FormLabel>
                                <Stack width="90%">
                                    <Input
                                        id="title"
                                        backgroundColor="white"
                                        defaultValue={recipeData.title}
                                        placeholder="Busca tu receta favorita."
                                        color="black"
                                        _placeholder={{ color: 'gray.500' }}
                                        {...register("title")}
                                    />
                                    <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                                </Stack>
                            </FormControl>
                            <FormControl isInvalid={errors.description} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Descripcion:</FormLabel>
                                <Stack width="90%">
                                    <Controller
                                        name="description"
                                        control={control}
                                        defaultValue={recipeData.description}
                                        render={({ field }) => <Textarea
                                                                    {...field}
                                                                    backgroundColor="white"
                                                                    placeholder="Describe la receta."
                                                                    defaultValue={recipeData.description}
                                                                    _placeholder={{ color: 'gray.500' }}
                                                                    color="black"
                                                                />}
                                    />
                                    <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                                </Stack>
                            </FormControl>
                            <FormControl isInvalid={errors.tags} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Categorias:</FormLabel>
                                <Stack width="90%" color="black">
                                    <Box color="black">
                                        <Select
                                            defaultValue={categoriasValues}
                                            onChange={handleCategory}
                                            components={animatedComponents}
                                            options={categorias}
                                            isMulti
                                            placeholder="Selecciona..."
                                        />
                                    </Box>
                                </Stack>
                                <Tooltip label="Selecciona maximo 3 categorias que describan esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                            </FormControl>
                            <FormControl isInvalid={errors.ingredients} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Ingredientes principales:</FormLabel>
                                <Stack width="90%">
                                    <Box color="black">
                                        <Select
                                            defaultValue={ingredientesPrincipalesValues}
                                            onChange={handleIngredient}
                                            components={animatedComponents}
                                            options={ingredientes}
                                            isMulti
                                            placeholder="Selecciona..."
                                        />
                                    </Box>
                                    <Text display={ingredientsError||categoriaError ? "inline" : "none"} color="red">Ingresa entre 1 a 3 categorias y 1 a 5 ingredientes</Text>
                                </Stack>
                                <Tooltip label="Selecciona maximo 5 ingredientes principales que contiene esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                            </FormControl>
                            <FormControl isInvalid={errors.ingredientsQuantity} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Cantidad de ingredientes: </FormLabel>
                                <NumberInput max={99} min={1} width="300px" id="ingredientsQuantity" backgroundColor="white" color="black" defaultValue={recipeData.ingredientsAmount} onChange={handleIngredientsAmount}>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper color="black"/>
                                        <NumberDecrementStepper color="black"/>
                                    </NumberInputStepper>
                                </NumberInput>
                                <Tooltip label="Indica cuantos ingredientes utiliza esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                            </FormControl>
                            <FormControl isInvalid={errors.ingredientsQuantity} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Porciones: </FormLabel>
                                <NumberInput max={99} min={1} width="300px" name="portions" backgroundColor="white" color="black" defaultValue={recipeData.servingsAmount} onChange={handlePortionsAmount}>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper color="black"/>
                                        <NumberDecrementStepper color="black"/>
                                    </NumberInputStepper>
                                </NumberInput>
                                <Tooltip label="Indica cuantas porciones tiene esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                            </FormControl>
                            <FormControl isInvalid={errors.ingredientsQuantity} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Calorías por porción: </FormLabel>
                                <NumberInput max={9999} min={1} width="300px" name="calories" backgroundColor="white" color="black" defaultValue={recipeData.caloriesPerServing} onChange={handleCaloriesAmount}>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper color="black"/>
                                        <NumberDecrementStepper color="black"/>
                                    </NumberInputStepper>
                                </NumberInput>
                                <Tooltip label="Indica cuantas calorias contiene cada porcion de esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                            </FormControl>
                                <FormControl isInvalid={errors.thumbnail} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Foto del platillo: </FormLabel>
                                <Stack>
                                    <Controller
                                        name="thumbnail"
                                        control={control}
                                        render={({field:{onChange}})=><ImageUpload
                                                    onChange={onChange}
                                                    thumbnail={recipeData.thumbnail}
                                                />}
                                    />
                                    <FormErrorMessage>{errors.thumbnail && errors.thumbnail.message}</FormErrorMessage>
                                </Stack>
                            </FormControl>
                        </form>
                    </Box>
                    <HStack marginLeft="5%" marginTop="20px">
                        <Image src="https://cdn-icons-png.flaticon.com/512/179/179350.png" width="30px"></Image>
                        <Text textAlign="left" fontSize="xl" fontWeight="500">instrucciones para la receta:</Text>
                    </HStack>
                    {
                        stepsData.map((element, index)=>(
                            <RecipeStepContainer key={index} step={index} onChangeStep={handleStepData} defaultText={element.description} imgUrl={element.img}/>
                        ))
                    }
                    <HStack margin="0 auto" marginTop="30px" marginBottom="80px">
                        <Button display={stepsData.length < 2 ? "none" : "inline"} width="250px" height="50px" colorScheme="red" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={deleteStep}>Eliminar paso</Button>
                        <Button display={stepsData.length===15 ? "none" : "inline"} disabled={stepsDisable} width="250px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={addNewStep}>Agregar otro paso</Button>
                        <form onSubmit={handleSubmit(submitRecipe)}>
                            <Button disabled={(stepsDisable || categoriaError || ingredientsError)} type="submit" width="250px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" isLoading={isSubmitting}>Finalizar</Button>
                        </form>
                    </HStack>
                </Box>
            </Box>
        )
    }

    function loadingView(){
        return (
            <Text>LOADING</Text>
        )
    }

    return(
        <Box>
            {
                loaded ? (recipeEditView()) : (loadingView())
            }
        </Box>
    )
}