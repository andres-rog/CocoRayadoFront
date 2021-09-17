import React from "react";
import {
  useColorMode,
  Text,
  Textarea,
  FormLabel,
  Box
} from "@chakra-ui/react";
import ImageUpload from '../Container/ImageUpload';

import {useState} from 'react';

let imageSrc=null;

function RecipeStepContainer({step=0, onChangeStep=()=>{}, defaultText="", imgUrl=""}) {
    const {colorMode} = useColorMode();
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);

    function handleDescription(e) {
        setDescription(e.target.value);
        onChangeStep({step, imageSrc:imageFile, description:e.target.value});
    }

    function handleImage(e) {
        setImageFile(e.file);
        onChangeStep({step, imageSrc:e.file, description:description});
    }

  return (
    <Box>
        <Text marginLeft="5%" textAlign="left" fontSize="xl" fontWeight="500">{`PASO ${step+1}`}</Text>
        <Box
        width="90%"
        borderRadius="5"
        borderWidth={1}
        borderColor={(colorMode === "light") ? "#333" : "#fff"}
        backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}
        margin="0 auto"
        marginBottom="10px"

        display="flex"
        flexDir="column"
        >
            <Box display="flex" flexDir="column" alignContent="center" alignItems="center">
                <FormLabel minW="210px" fontSize="lg">Descripcion:</FormLabel>
                <Textarea
                    defaultValue={defaultText}
                    marginBottom="10px"
                    width="90%"
                    height="180px"
                    id="description"
                    backgroundColor="white"
                    placeholder={`Describe el paso ${step+1} para realizar tu receta`}
                    color="black"
                    onChange={handleDescription}
                    _placeholder={{ color: 'gray.500' }}
                />
                <Text color="red" marginBottom="10px" display={description.length>500 ? "inline" : "none"}>La descripcion no puede tener mas de 500 caracteres.</Text>
            </Box>
            <ImageUpload onChange={handleImage} thumbnail={imgUrl}/>
        </Box>
    </Box>
  );
}

export default RecipeStepContainer;