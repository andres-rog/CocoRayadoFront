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

function RecipeStepContainer({step=0, onChangeStep=()=>{}}) {
    const {colorMode} = useColorMode();
    const [description, setDescription] = useState('');

    function handleDescription(e) {
        setDescription(e.target.value);
        onChangeStep({step, imageSrc:imageSrc, description:description});
    }

    function handleImage(e) {
        imageSrc = e.file;
        onChangeStep({step, imageSrc:imageSrc, description:description});
    }

  return (
    <Box>
        <Text marginLeft="5%" textAlign="left" fontSize="xl" fontWeight="500">{`PASO ${step+1}`}</Text>
        <Box
        width="90%"
        borderRadius="5"
        borderWidth={1}
        borderColor={(colorMode === "light") ? "#333" : "#fff"}
        backgroundColor={(colorMode === "light") ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}
        margin="0 auto"
        marginBottom="10px"

        display="flex"
        flexDir="column"
        >
            <Box display="flex" flexDir="column" alignContent="center" alignItems="center">
                <FormLabel minW="210px" fontSize="lg">Descripcion:</FormLabel>
                <Textarea
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
            <ImageUpload onChange={handleImage}/>
        </Box>
    </Box>
  );
}

export default RecipeStepContainer;