import React from 'react';
import Form from "react-bootstrap/Form";
import classes from "./recipeIngredient.module.css";
import Button from "react-bootstrap/Button";

const defaultUnits = [
    {
        id: 0,
        name: "g"
    },
    {
        id: 1,
        name: "dg"
    },
    {
        id: 2,
        name: "kg"
    },
    {
        id: 3,
        name: "ml"
    },
    {
        id: 4,
        name: "dl"
    },
    {
        id: 5,
        name: "l"
    },
    {
        id: 6,
        name: "ks"
    }
]

const RecipeIngredient = (props) => {
    return (
        <React.Fragment>
            <Form.Group className={`${classes['ingredient-group']} mb-3`}>
                <Form.Control {...props.register(`ingredient_${props.id}.name`, {required: true})} defaultValue={props.ingredientData?.name}
                              type="text" placeholder="Název suroviny" aria-label="Surovina" className={classes.ingredient_name} />

                <Form.Control {...props.register(`ingredient_${props.id}.amount`, {required: true})}  defaultValue={props.ingredientData?.amount}
                              type="number" placeholder="Množství" aria-label="Množství" className={classes.ingredient_amount}/>

                <Form.Select {...props.register(`ingredient_${props.id}.units`, {required: true})}  defaultValue={props.ingredientData?.units}
                             className={classes.ingredient_unit}>
                    {
                        defaultUnits.map(unit => (
                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                        ))
                    }
                </Form.Select>
                <Button variant="outline-danger" onClick={()=>{props.removeIngredient(props.id)}}>
                    X
                </Button>
            </Form.Group>
        </React.Fragment>
    );
};

export default RecipeIngredient;