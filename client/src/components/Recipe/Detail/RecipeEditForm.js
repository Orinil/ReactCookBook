import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import React, {useEffect, useState} from "react";
import classes from "./recipeEditForm.module.css"
import {v1} from "uuid";
import RecipeIngredient from "../RecipeIngredient";
import {Spinner} from "react-bootstrap";

/**
 * CategoryForm - formulář na přidání nového receptu
 * */
const CategoryForm = ({showModal, setShowModal, recipeData, refreshRecipeDetail}) => {

    let defaultFormValues = {...recipeData}
    delete defaultFormValues.category
    delete defaultFormValues.ingredients

    const { register, handleSubmit, reset, resetField, setValue, unregister, formState: { errors } } = useForm({defaultValues: {
            ...defaultFormValues
        }})
    const [categories, setCategories] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [formError, setFormError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)


    useEffect(()=>{
        /**
         * Nasetování state proměnné ingredients, ke každé se přidá unikátní id pro identifikaci
         * */
        let ingredients = recipeData.ingredients.map(ingredient => ({...ingredient, id: v1().substring(0, 8)}))
        setIngredients(ingredients)
        /**
         * Načtení kategorií
         * */
        fetch("http://localhost:3000/category/list").then(response => response.json()).then(data => setCategories(data));
    },[])

    /**
     * Protože kategorie načítáme asynchroně, musíme defaultní hodnotu selectu kategorií nastavit poté, co se asynchroní call dokončí
     * */
    useEffect(()=> {
        setValue('category', recipeData.category)
    }, [categories])


    /**
     * addRecipe
     * Funkce s post requestem na založení receptu
     * @param recipe - objekt parametrů receptu
     * */
    const editRecipe = (recipe) => {
        // extrakt ingrediencí - místo ingredient_{id1}, ingredient_{id2} chceme v objektu recipe mít pole
        // ingrediencí jako pole objektů [{},{}]
        let ingredients = []
        for(let key in recipe){
            if(key.startsWith("ingredient_")){
                ingredients.push(recipe[key])
                delete recipe[key]
            }
        }
        recipe.ingredients = [
            ...ingredients
        ]

        fetch("http://localhost:3000/recipes/update", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        }).then((res) => res.json().then((data)=>{
            if(res.status === 200){
                setTimeout(() => {
                    reset()
                    refreshRecipeDetail(data)
                    setShowModal(false);
                },2000)
            } else {
                setFormError("Někde nastala chyba")
                console.log(res)
            }
        }))
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

        fetch("http://localhost:3000/image/create", {
            method: "post",
            body: formData
        }).then((res) => {
            if(res.status === 200){
                window.alert("recept přidán")
            } else {
                /*TODO: odebrat recept pokud se k němu nenahrála fotka, error handling */
            }
        })
    }

    /**
     * newMealFormSubmitHandler
     * submit funkce, nejdříve se uloží recept a poté se s jeho id uploadne obrázek
     * @param data - objekt obsahující všecha data z formuláře
     * */
    const editRecipeFormSubmitHandler = (data) => {
        setFormError("")
        setIsSubmitting(true)
        editRecipe(data)
    }

    /**
     * addIngredientHandler
     * funkce která do State proměnné ingredients vloží nový objekt reprezentující novou ingredienci
     * id ingredience je generováno jako unikátní klíč
     * */
    const addIngredientHandler = () => {
        let newIngredient = {
            id: v1().substring(0,8)
        }

        let newIngredients = [...ingredients]
        newIngredients.push(newIngredient)

        setIngredients(newIngredients)
    }

    /**
     * removeIngredientHandler
     * funkce která ze state proměnné ingredients odebere ingredienci dle id
     * zároveň musí být volána funkce unregister() aby se odebral i ref a nedocházelo k odeslání odebraných ingrediencí při submitu
     * @param id - id ingredience
     * */
    const removeIngredientHandler= (id) => {
        let newIngredients = [...ingredients]

        if(newIngredients.length > 1) {
            unregister(`ingredient_${id}`)
            setIngredients( newIngredients.filter(x => x.id !== id))
        } else {
            resetField(`ingredient_${id}.name`)
            resetField(`ingredient_${id}.amount`)
            resetField(`ingredient_${id}.units`)
        }
    }

    const onModalHideHandler = () => {
        setIngredients([ingredients[0]])
        reset()
        setShowModal(false)
    }

    return (
        <React.Fragment>
            <Modal show={showModal} onHide={onModalHideHandler} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Upravit recept</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(editRecipeFormSubmitHandler)} encType={"multipart/form-data"} id="newRecipeForm">
                        <Form.Group className="mb-3" controlId="mealForm.name">
                            <Form.Label>Název</Form.Label>
                            <Form.Control
                                {...register("name", {required: true})}
                                type="text"
                                placeholder="např. Vepřové na houbách"
                            />
                            <p className="form-error">{errors.name?.type === 'required' && "Vyplňte název receptu"}</p>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="mealForm.description">
                            <Form.Label>Popis</Form.Label>
                            <Form.Control
                                {...register("desc", {required: false})}
                                type="text"
                                placeholder="např. zajímavosti o jídle"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Kategorie</Form.Label>
                            <Form.Select {...register("category", {required: true})}>
                                {
                                    categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))
                                }
                            </Form.Select>
                            <p className="form-error">{errors.category?.type === 'required' && "Vyberte kategorii receptu"}</p>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="mealForm.preparation">
                            <Form.Label>Postup</Form.Label>
                            <Form.Control {...register("prep", {required: true})} as="textarea" placeholder="např. Do mouky přidejte špetku"/>
                            <p className="form-error">{errors.prep?.type === 'required' && "Vyplňtě postup receptu"}</p>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="mealForm.preptime">
                            <Form.Label>Doba přípravy (v minutách)</Form.Label>
                            <Form.Control
                                {...register("preptime", {required: true, min: 1})}
                                type="number"
                                placeholder="např. 90"
                            />
                            <p className="form-error">{errors.preptime?.type === 'required' ? "Doba přípravy povinná!" : errors.time?.type === 'min' && "Nespravná doba přípravy"}</p>
                        </Form.Group>

                        <Button variant="primary" onClick={addIngredientHandler}>Přidat ingredienci</Button><br /><br />
                        <Form.Label>Suroviny</Form.Label>
                        {ingredients.map((ingredient) => {
                            return <RecipeIngredient key={ingredient.id} id={ingredient.id} register={register} errors={errors} ingredientData={ingredient} removeIngredient={removeIngredientHandler}/>
                        })}

                        <Form.Group className="mb-3" controlId="mealForm.person_no">
                            <Form.Label>Počet osob</Form.Label>
                            <Form.Control
                                {...register("person_no", {required: true, min: 1})}
                                type="number"
                                placeholder="např. 4"
                            />
                            <p className="form-error">{errors.preptime?.type === 'required' ? "Vyplňte počet osob": errors.time?.type === 'min' && "Nespravná doba přípravy"}</p>
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
    )
}

export default CategoryForm;