import React, {useMemo} from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import classes from './recipes.module.css'
import RecipeForm from "./RecipeForm";
import '../../App.css';
import RecipeFilter from "./RecipeFilter";
import * as Icon from 'react-bootstrap-icons';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('')
    const [searchName, setSearchName] = useState('')
    const navigate = useNavigate();

    const showRecipeDetail = (id) => {
        navigate(`/recipe/${id}`)
    }

    const getFilteredRecipes = () => {
        let filteredRecipes = recipes

        // Filtr receptů podle kategorie
        if (selectedCategory && selectedCategory!=="all") {
            filteredRecipes = recipes.filter(recipe => recipe.category === selectedCategory)
        }

        // Filtr receptů podle názvu, filtrujeme až od 3 zadaných znaků
        if(searchName && searchName.trim() !== '' && searchName.trim().length > 2){
            filteredRecipes = filteredRecipes.filter(recipe => recipe.name.toUpperCase().includes(searchName.toUpperCase()))
        }

        return filteredRecipes
    }

    const filteredRecipes = useMemo(getFilteredRecipes, [selectedCategory, searchName, recipes])

    const categoryChangeHandler = (e) => {
        setSelectedCategory(e.target.value)
    }

    const nameChangeHandler = (e) => {
        setSearchName(e.target.value)
    }

    const loadRecipes = () => {
        fetch("http://localhost:3000/recipes/list").then(response => response.json()).then(data => setRecipes(data))
    }


    useEffect(() => {
        loadRecipes()
    }, [])

    return (
        <React.Fragment>
            {/* RecipeForm - formulář na přidání nového receptu */}
            <Button className={classes.addBtn} onClick={() => setShowModal(true)}>Vytvořit recept</Button>
            {showModal && <RecipeForm showModal={showModal} setShowModal={setShowModal} loadRecipes={loadRecipes}/>}

            {/* RecipeFilter - filter */}
            {filteredRecipes.length > 0 && <RecipeFilter onChangeCategory={categoryChangeHandler} onChangeName={nameChangeHandler}/>}

            <div>
                <div className={classes['recipes-grid']}>
                    {filteredRecipes.map(recipe => (
                        <Card key={recipe.id} className={classes.card} onClick={() => showRecipeDetail(recipe.id)}>
                            <Card.Img variant="top" src={`${process.env.REACT_APP_BACKEND_PATH}/${recipe.id}.${recipe.imageExt}`} />
                            <Card.Body>
                                <div className={classes['recipe-info']}>
                                    <Card.Title>{recipe.name}</Card.Title>
                                    <Card.Text>
                                        <span><Icon.Stopwatch />&nbsp;{recipe.preptime} min</span>
                                    </Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Recipes;