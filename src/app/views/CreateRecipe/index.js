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
import {upload} from '../../services/apiRoutes';
import {createRecipeEndpoint} from '../../services/apiRoutes';
import {categorias, ingredientes} from '../../assets/data.json';
import { number } from "yup/lib/locale";

const schema = yup.object().shape({
  title: yup.string().min(5,'El título es muy corto.'),
  description: yup.string().min(30,'La descripción es muy corta.').max(200,'La descripción es demaciado larga.'),
  ingredientsQuantity: yup.number().min(1).max(99),
  ingredients: yup.array().min(1,'Debes agregar por lo menos un ingrediente principal.').max(5,'No puedes elegir mas de 5 ingredientes principales.'),
  tags: yup.array().min(1,'Debes elegir por lo menos una categoría.').max(3,'No puedes elegir más de 3 categorías.'),
  thumbnail: yup.object().nullable().required('Agrega una foto del platillo.'),
});

let stepsData = [{description:'', img:null}];
let numberInputValues = {ingredientsAmount:1,portions:1,calories:1};

export default function CreateRecipe({history}) {
    const [stepsDisable, setStepsDisable] = useState(true);
    const [loaded, setLoaded] = useState(false);

    const {colorMode} = useColorMode();

    const animatedComponents = makeAnimated();

    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    function addNewStep() {
        stepsData.push({image:null,description:null});
        setStepsDisable(true);
    }

    function deleteStep() {
        stepsData.pop();
        setStepsDisable(false);
    }

    function handleStepData(e) {
        stepsData[e.step]={img:e.imageSrc,description:e.description};
        let disable=false;
        stepsData.map((element)=>{
            if(element.description.length>500 || element.description.length<20) disable=true;
        });
        setStepsDisable(disable);
    }

    function handleIngredientsAmount(e){
        numberInputValues.ingredientsAmount=e;
    }
    function handlePortionsAmount(e){
        numberInputValues.portions=e;
    }
    function handleCaloriesAmount(e){
        numberInputValues.calories=e;
    }

    function submitRecipe(values){
        Swal.fire({
            title: '¿Deseas crear la receta con estas opciones?',
            showDenyButton: true,
            confirmButtonText: `¡Si, crear!`,
            denyButtonText: `¡Aun no!`,
            showLoaderOnConfirm: true,
        })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Creando tu receta',
                    html: 'Por favor espera…',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const createRecipe = {
                            title:values.title,
                            description:values.description,
                            thumbnail:values.thumbnail.file,
                            servingsAmount:numberInputValues.portions,
                            ingredientsAmount:numberInputValues.ingredientsAmount,
                            caloriesPerServing:numberInputValues.calories,
                            tags:values.tags,
                            ingredients:values.ingredients,
                            step:stepsData
                        };
                        const createRecipePromise = () => createRecipeEndpoint(createRecipe);
                        createRecipePromise()
                            .then(()=>{
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡La receta se creó exitosamente!'
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

    useEffect(() => {
        if(!loaded) {
            stepsData = [{description:'', img:null}];
            numberInputValues = {ingredientsAmount:1,portions:1,calories:1};
            setLoaded(true);
        }
    },[]);

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
                <Text fontSize="4xl" fontWeight="500" margin={4}>¡Comparte tu receta!</Text>
            </Box>
            <Divider marginTop={5} marginBottom={5}/>
            <Box display="flex" flexDir="column">
                <HStack marginLeft="5%" marginBottom="5px">
                    <Image src="https://cdn-icons-png.flaticon.com/512/179/179349.png" width="30px"></Image>
                    <Text textAlign="left" fontSize="xl" fontWeight="500">Comencemos con la información básica:</Text>
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
                                    placeholder="Busca tu receta favorita."
                                    color="black"
                                    _placeholder={{ color: 'gray.500' }}
                                    {...register("title")}
                                />
                                <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                            </Stack>
                        </FormControl>
                        <FormControl isInvalid={errors.description} display="flex" alignItems="center" padding={3}>
                            <FormLabel minW="210px" fontSize="lg">Descripción:</FormLabel>
                            <Stack width="90%">
                                <Controller
                                    name="description"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <Textarea
                                                                {...field}
                                                                backgroundColor="white"
                                                                placeholder="Describe la receta."
                                                                _placeholder={{ color: 'gray.500' }}
                                                                color="black"
                                                            />}
                                />
                                <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                            </Stack>
                        </FormControl>
                        <FormControl isInvalid={errors.tags} display="flex" alignItems="center" padding={3}>
                            <FormLabel minW="210px" fontSize="lg">Categorías:</FormLabel>
                            <Stack width="90%" color="black">
                                <Box color="black">
                                    <Controller
                                        name="tags"
                                        control={control}
                                        defaultValue={[]}
                                        render={({field:{onChange, value, ref}})=><Select
                                                            inputRef={ref}
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
                            <Tooltip label="Selecciona máximo 3 categorías que describan esta receta."><QuestionIcon marginLeft="5px" width="30px"/></Tooltip>
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
                            <NumberInput max={99} min={1} width="300px" name="ingredientsAmount" backgroundColor="white" color="black" defaultValue="1" onChange={handleIngredientsAmount}>
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
                            <NumberInput max={99} min={1} width="300px" name="portions" backgroundColor="white" color="black" defaultValue="1" onChange={handlePortionsAmount}>
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
                            <NumberInput max={9999} min={1} width="300px" name="calories" backgroundColor="white" color="black" defaultValue="1" onChange={handleCaloriesAmount}>
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
                    <Text textAlign="left" fontSize="xl" fontWeight="500">Continuemos con las instrucciones para la receta:</Text>
                </HStack>
                {
                    stepsData.map((element, index)=>(
                        <RecipeStepContainer key={index} step={index} onChangeStep={handleStepData}/>
                    ))
                }
                <HStack margin="0 auto" marginTop="30px" marginBottom="80px">
                    <Button display={stepsData.length < 2 ? "none" : "inline"} width="250px" height="50px" colorScheme="red" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={deleteStep}>Eliminar paso</Button>
                    <Button display={stepsData.length===15 ? "none" : "inline"} disabled={stepsDisable} width="250px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" onClick={addNewStep}>Agregar otro paso</Button>
                    <form onSubmit={handleSubmit(submitRecipe)}>
                        <Button disabled={stepsDisable} type="submit" width="250px" height="50px" colorScheme="teal" borderWidth={2} borderColor="rgb(40,100,100)" fontSize="xl" isLoading={isSubmitting}>Finalizar</Button>
                    </form>
                </HStack>
            </Box>
        </Box>
    )
}