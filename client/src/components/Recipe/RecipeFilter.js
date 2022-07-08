import React, {useEffect, useState} from 'react';
import {Button, Form, FormControl} from "react-bootstrap";
import classes from './recipeFilter.module.css'

const RecipeFilter = (props) => {
    const [categories, setCategories] = useState([])

    const loadCategories = () => {
        fetch("http://localhost:3000/category/list").then(response => response.json()).then(data => setCategories(data))
    }

    useEffect(() => {
        loadCategories()
    }, [])

    return (
        <div className={classes['filter-row']}>
            <Form.Select className={classes.category} onChange={props.onChangeCategory}>
                <option key="all" value="all" defaultValue="all">Vše</option>
                {categories.map(category => {
                    return <option key={category.id} value={category.id}>{category.name}</option>
                })}
            </Form.Select>

            <Form className={classes.name}>
                <FormControl
                    type="search"
                    placeholder="Hledat podle názvu"
                    className="me-2"
                    aria-label="Hledat podle názvu"
                    onChange={props.onChangeName}
                />
            </Form>
        </div>
    );
};

export default RecipeFilter;