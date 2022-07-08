import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Button, Image} from "react-bootstrap";
import RecipeEditForm from "./RecipeEditForm";
import RecipeEditImage from "./RecipeEditImage";

const RecipeDetail = () => {
    const { id } = useParams()
    const [recipe, setRecipe] = useState({})
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [imageHash, setImageHash] = useState(Date.now());

    const [showModalImage, setShowModalImage] = useState(false);
    const [categories, setCategories] = useState({})

    const getRecipe = (id) => {
        fetch(`http://localhost:3000/recipes/get/${id}`).then(response => response.json()).then(data => {
            setRecipe(data)
        });
    }

    const onDeleteHandler = (id) => {
        if(window.confirm("Opravdu chcete tento recept smazat?")){
            fetch("http://localhost:3000/recipes/delete", {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            }).then((res) => res.json().then((data)=>{
                if(res.status === 200){
                    fetch("http://localhost:3000/image/delete", {
                        method: "delete",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id,
                            ext: recipe.imageExt
                        })
                    }).then((res) => res.json().then((data)=>{
                        if(res.status === 200){
                            setRecipe({})
                        } else {
                            console.log(res)
                        }
                    }))
                } else {
                    console.log(res)
                }

            }))
        }
    }

    const loadCategories = () => {
        fetch("http://localhost:3000/category/list").then(response => response.json()).then(data => setCategories(data));
    }

    useEffect(() => {
        getRecipe(id);
        loadCategories();
    }, [])

    return (
        <div>
            {/*TODO: dodělat strukturu detail stránky*/}
            recipe: {recipe.name}

            <Button onClick={()=>setShowModalEdit(true)}>Edit</Button>
            <Button onClick={()=>setShowModalImage(true)}>Edit Image</Button>
            <Button variant={"danger"} onClick={() => onDeleteHandler(recipe.id)}>Delete Recipe</Button> <br /><br />

            {showModalEdit && <RecipeEditForm showModal={showModalEdit} setShowModal={setShowModalEdit} recipeData={recipe} refreshRecipeDetail={setRecipe}/>}
            {showModalImage && <RecipeEditImage showModal={showModalImage} setShowModal={setShowModalImage}
                                                recipeId={id} setImageHash={setImageHash} refreshRecipeData={getRecipe}/>}
            <h1>{recipe.name}</h1>
            <p>{recipe.desc}</p>
            <div className='container-recipe'>
                <Image src={`${process.env.REACT_APP_BACKEND_PATH}/${recipe.id}.${recipe.imageExt}?${imageHash}`}></Image>
                <div className='time-container'>
                    <p>Doba přípravy: {recipe.preptime} min</p>
                    <p>Počet osob: {recipe.person_no}</p>
                    {categories && categories.map && categories.map((category) => {
                        if (category.id === recipe.category) {
                            return <p>Kategorie: {category.name}</p>
                        }
                    })}
                </div>
            </div>
            <div>
                <h2>Suroviny</h2>
                {recipe?.ingredients?.map((ingredient) => {
                    return (
                        <ul>
                            <li>{ingredient.amount+" "}
                            {ingredient.units === "0" && "g"}
                            {ingredient.units === "1" && "dg"}
                            {ingredient.units === "2" && "kg"}
                            {ingredient.units === "3" && "ml"}
                            {ingredient.units === "4" && "dl"}
                            {ingredient.units === "5" && "l"}
                            {ingredient.units === "6" && "ks"}
                            {" "+ ingredient.name}</li>
                        </ul>
                    )
                })
                }
            </div>
            <div>
                <h2>Postup</h2>
                <p>{recipe.prep}</p>
            </div>
        </div>
    );
};

export default RecipeDetail;