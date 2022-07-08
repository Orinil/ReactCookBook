import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import classes from "./recipeEditForm.module.css";
import {Spinner} from "react-bootstrap";
import {useForm} from "react-hook-form";

const RecipeEditImage = ({showModal, setShowModal, recipeId, setImageHash, refreshRecipeData}) => {
    const [formError, setFormError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, reset, resetField, setValue, unregister, formState: { errors } } = useForm({
        defaultValues: {
            recipeId: recipeId
        }
    })

    const onModalHideHandler = () => {
        reset()
        setShowModal(false)
    }

    /**
     * uploadImage
     * Funkce s post requestem upload obrázku receptu
     *  - volá se až po funkci addRecipe
     *  @param image - obrázek typu File
     *  @param recipeId - id existujícího receptu
     * */
    const uploadImage = (image, recipeId) => {
        let formData = new FormData()
        formData.append("id", recipeId)
        formData.append("image", image)

        fetch("http://localhost:3000/image/edit", {
            method: "post",
            body: formData
        }).then((res) => res.json().then((data)=>{
            if(res.status === 200){
                setTimeout(() => {
                    setIsSubmitting(false)
                    // Reset form
                    reset()
                    // aktualizace dat o receptu
                    refreshRecipeData(recipeId)
                    // aktualizace hashe za obrazkem - kvuli cache prohlizece
                    setImageHash(Date.now())
                    // zavřít okno
                    setShowModal(false)
                }, 2000)
            } else {
                setIsSubmitting(false)
                setFormError(data.error)
                console.log(data)
            }
        }))
    }


    const editRecipeImageSubmitHandler = (data) => {
        setIsSubmitting(true)
        uploadImage(data.image[0], data.recipeId)
    }

    return (
            <React.Fragment>
                <Modal show={showModal} onHide={onModalHideHandler} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Upravit recept</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit(editRecipeImageSubmitHandler)} encType={"multipart/form-data"} id="newRecipeForm">
                            <Form.Group controlId="mealForm.image" className="mb-3">
                                <Form.Label>Obrázek jídla</Form.Label>
                                <Form.Control {...register("image", {required: true})}
                                              type="file" accept=".png,.jpeg,.jpg"

                                />
                                <p className="form-error">{errors.image?.type === 'required' && "Vyberte obrázek receptu"}</p>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <p className={classes['form-error']}>{formError}</p>
                        <Button variant="primary" type="submit" className={classes['submit-btn']} form="newRecipeForm" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Upravit recept"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
    );
};

export default RecipeEditImage;