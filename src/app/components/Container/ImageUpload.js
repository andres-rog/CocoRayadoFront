import React from "react";
import placeholderImage from '../../assets/imagePlaceholder.jpg';
import {
  Image,
  Input,
  Box,
  useColorMode
} from "@chakra-ui/react";

import {useState} from 'react';


function ImageUpload({onChange=()=>{}}) {
    const [placeholder, setPlaceholder] = useState(false);
    const {colorMode} = useColorMode();

    function onChangeHanlder(e){
        setPlaceholder(e.target.files[0]);
        onChange({file: e.target.files[0]});
    }

  return (
    <Box
        width="fit-content"
        margin="0 auto"
        marginBottom={2}
        borderRadius="5"
        borderWidth={1}
            borderColor={(colorMode === "light") ? "#333" : "#fff"}
        >
        <Input
            marginTop="5px"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            width="300px"
            id="thumbnail"
            border="none"
            onChange={onChangeHanlder}
        />
        <Image src={placeholder ? URL.createObjectURL(placeholder) : placeholderImage} width="200px" margin="0 auto" marginBottom={2}/>
    </Box>
  );
}

export default ImageUpload;