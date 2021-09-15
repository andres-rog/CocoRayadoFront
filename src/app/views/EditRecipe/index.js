import React from "react";

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
import {useState, useEffect} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Swal from 'sweetalert2';

import {categorias, ingredientes} from '../../assets/data.json';

const schema = yup.object().shape({
  title: yup.string().min(5,'El titulo es muy corto.'),
  description: yup.string().min(30,'La descripcion es muy corta.').max(200,'La descripcion es demaciado larga.'),
  ingredientsQuantity: yup.number().min(1).max(99),
  ingredients: yup.array().min(1,'Debes agregar por lo menos un ingrediente principal').max(5,'No puedes elegir mas de 5 ingredientes principales.'),
  tags: yup.array().min(1,'Debes elegir por lo menos una categoria').max(3,'No puedes elegir mas de 3 categorias.'),
  thumbnail: yup.object().nullable().required('Agrega una foto del platillo.'),
});

const animatedComponents = makeAnimated();
let stepsData = [{description:'', imageSrc:null}];

let defaultCategorias=[];
let defaultIngredientes=[];
let obtainedData=false;

const recipeExampleData = {
    title:"test title",
    description:"test description test description test description test description test description test description",
    categorias:["Mexicana", "Vegana"],
    ingredientes:["Res"],
    cantidadIngredientes:"5",
    cantidadPorciones:"3",
    caloriasPorcion:"400",
    thumbnail:"https://cdn-icons-png.flaticon.com/512/179/179349.png",
    steps:[
        {description:"paso 1 description paso 1 description paso 1 description paso 1 description paso 1 description paso 1 description", img:"https://cdn-icons-png.flaticon.com/512/179/179349.png"},
        {description:"paso 2 description paso 2 description paso 2 description paso 2 description paso 2 description paso 2 description", img:"https://cdn-icons-png.flaticon.com/512/179/179349.png"},
        {description:"paso 3 description paso 3 description paso 3 description paso 3 description paso 3 description paso 3 description", img:"https://cdn-icons-png.flaticon.com/512/179/179349.png"}
    ]
}

export default function CreateRecipe({history}) {
    const [recipeData, setRecipeData] = useState({});
    const [steps, setSteps] = useState([{step:1}]);
    const [stepsDisable, setStepsDisable] = useState(true);
    const {colorMode} = useColorMode();

    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    function addNewStep() {
        setSteps([...steps, {step:(steps.length+2)}]);
        stepsData = [...stepsData,{image:null,description:null}];
        setStepsDisable(true);
    }

    function deleteStep() {
        let stepArray = steps;
        stepArray.pop();
        stepsData.pop();
        setSteps([...stepArray]);
        setStepsDisable(false);
    }

    function handleStepData(e) {
        stepsData[e.step]={imageSrc:e.imageSrc,description:e.description};
        let disable=false;
        stepsData.map((element)=>{
            if(element.description.length>500 || element.description.length<20) disable=true;
        });
        setStepsDisable(disable);
    }

    function submitRecipe(values){
        Swal.fire({
            title: '¿Deseas terminar tu receta?',
            showDenyButton: true,
            confirmButtonText: `¡Si, terminar!`,
            denyButtonText: `¡Aun no!`,
            showLoaderOnConfirm: true,
            preConfirm: ()=>{
                return new Promise((resolve) => {
                    setTimeout(() => {
                      alert(JSON.stringify({values,stepsData}, null, 2));
                      resolve();
                    }, 3000);
                })
                .catch(error => {
                    console.log(error);
                    Swal.showValidationMessage(`¡Oh no! Sucedio un error inesperado :c`);
                });
            },
            allowOutsideClick: () => !Swal.isLoading()
        })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire('!La receta ha sido creada exitosamente!', '', 'success')
                .then(()=>{
                    console.log("Receta terminada",{values, stepsData});
                    history.push('/dashboard');
                });
            }
        })
    }

    useEffect(() => {
        if(!obtainedData) {
            recipeExampleData.categorias.map((element) => { defaultCategorias.push({"value":element, "label":element}) });
            recipeExampleData.ingredientes.map((element) => { defaultIngredientes.push({"value":element, "label":element}) });
            setRecipeData({
                title:recipeExampleData.title,
                description:recipeExampleData.description,
                categorias:defaultCategorias,
                ingredientes:defaultIngredientes,
                cantidadIngredientes:recipeExampleData.cantidadIngredientes,
                cantidadPorciones:recipeExampleData.cantidadPorciones,
                caloriasPorcion:recipeExampleData.caloriasPorcion,
                thumbnail:recipeExampleData.thumbnail,
                steps:recipeExampleData.steps
            })
            obtainedData=true;
        }
    }, [recipeData]);

    function recipeEditView(){
        return (
            <Box bgGradient={(colorMode === "dark") ? "linear(to-tl,#070a0d, #121921, #0f0613)" : "linear(to-tl,#86FFF5, #C0FFFA, #B8FFF9)"} minWidth="100vw" minHeight="100vh">
                {console.log(recipeData.cantidadIngredientes)}
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
                                        value={recipeData.title}
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
                                        render={({ field }) => <Textarea
                                                                    {...field}
                                                                    backgroundColor="white"
                                                                    placeholder="Describe la receta."
                                                                    value={recipeData.description}
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
                                        <Controller
                                            name="tags"
                                            control={control}
                                            render={({field:{onChange, value, ref}})=><Select
                                                                inputRef={ref}
                                                                defaultValue={defaultCategorias}
                                                                onChange={val => onChange(val.map(c => c.value))}
                                                                components={animatedComponents}
                                                                options={categorias}
                                                                isMulti
                                                                placeholder="Selecciona..."
                                                            />}
                                        />
                                    </Box>
                                    <FormErrorMessage>{errors.tags && errors.tags.message}</FormErrorMessage>
                                </Stack>
                                <Tooltip label="Selecciona maximo 3 categorias que describan esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                            </FormControl>
                            <FormControl isInvalid={errors.ingredients} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Ingredientes principales:</FormLabel>
                                <Stack width="90%">
                                    <Box color="black">
                                        <Controller
                                            name="ingredients"
                                            control={control}
                                            defaultValue={[]}
                                            render={({field:{onChange, value, ref}})=><Select
                                                                defaultValue={defaultIngredientes}
                                                                inputRef={ref}
                                                                onChange={val => onChange(val.map(c => c.value))}
                                                                components={animatedComponents}
                                                                options={ingredientes}
                                                                isMulti
                                                                placeholder="Selecciona..."
                                                            />}
                                        />
                                    </Box>
                                    <FormErrorMessage>{errors.ingredients && errors.ingredients.message}</FormErrorMessage>
                                </Stack>
                                <Tooltip label="Selecciona maximo 5 ingredientes principales que contiene esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                            </FormControl>
                            <FormControl isInvalid={errors.ingredientsQuantity} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Cantidad de ingredientes: </FormLabel>
                                <NumberInput max={99} min={1} width="300px" id="ingredientsQuantity" backgroundColor="white" color="black" defaultValue={recipeData.cantidadIngredientes}>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper color="black"/>
                                        <NumberDecrementStepper color="black"/>
                                    </NumberInputStepper>
                                </NumberInput>
                                <Tooltip label="Indica cuantos ingredientes utiliza esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
                            </FormControl>
                            <FormControl isInvalid={errors.thumbnail} display="flex" alignItems="center" padding={3}>
                                <FormLabel minW="210px" fontSize="lg">Foto del platillo: </FormLabel>
                                <Stack>
                                    <Controller
                                        name="thumbnail"
                                        control={control}
                                        defaultValue={null}
                                        render={({field:{onChange}})=><ImageUpload
                                                    onChange={onChange}
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
                        steps.map((element, index)=>(
                            <RecipeStepContainer key={index} step={index} onChangeStep={handleStepData}/>
                        ))
                    }
                    <HStack margin="0 auto" marginTop="30px" marginBottom="80px">
                        <Button display={steps.length < 2 ? "none" : "inline"} width="250px" height="50px" colorScheme="red" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={deleteStep}>Eliminar paso</Button>
                        <Button display={steps.length===15 ? "none" : "inline"} disabled={stepsDisable} width="250px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={addNewStep}>Agregar otro paso</Button>
                        <form onSubmit={handleSubmit(submitRecipe)}>
                            <Button disabled={stepsDisable} type="submit" width="250px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" isLoading={isSubmitting}>Finalizar</Button>
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
                recipeData.title ? (recipeEditView()) : (loadingView())
            }
        </Box>
    )
}