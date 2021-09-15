import React from "react";
import placeholderImage from '../../assets/imagePlaceholder.jpg';
import {
  Image,
  Input,
  Box,
  useColorMode
} from "@chakra-ui/react";
import {upload} from '../../services/apiRoutes';
import {useState} from 'react';
import loadingGIF from '../../assets/loading.gif';
import Swal from 'sweetalert2';

function ImageUpload({onChange=()=>{}}) {
    const [placeholder, setPlaceholder] = useState("");
    const {colorMode} = useColorMode();

    async function onChangeHanlder(e){
        try{
          setPlaceholder(loadingGIF);
          const formData = new FormData();
          for(let file of Array.from(e.target.files)){
            formData.append("img",file);
          }
          const response = await upload(formData);
          const url = response.data.data[0].newPath.url
          onChange({file: url});
          setPlaceholder(url);
        }
        catch(err){
          console.log(err);
          setPlaceholder("");
          Swal.fire({
            icon: 'error',
            title: '¡Oh no! sucedió un error al subir la imagen.',
            text: ':c'
          });
        }
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
            disabled={placeholder===loadingGIF ? "true" : null}
            marginTop="5px"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            width="300px"
            id="thumbnail"
            border="none"
            onChange={onChangeHanlder}
        />
        <Image src={placeholder ? placeholder : placeholderImage} width="200px" height="170px" margin="0 auto" objectFit="cover" marginBottom={2}/>
    </Box>
  );
}

export default ImageUpload;