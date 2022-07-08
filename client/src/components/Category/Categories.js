import React from "react";
import {useEffect, useState} from "react";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import classes from './categories.module.css'
import CategoryForm from "./CategoryForm";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [categoryId, setCategoryId] = useState(false);
    const [prevCategoryName, setPrevCategoryName] = useState("");

    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = () => {
        fetch("http://localhost:3000/category/list").then(response => response.json()).then(data => setCategories(data));
    }

    const deleteCategory = id => {
        if (window.confirm("Opravdu chcete smazat tuto kategorii?")) {
            fetch("http://localhost:3000/category/delete", {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            }).then(() => {
                loadCategories();
            })
        }
    }
    const updateCategory = (id, prevName) => {
        setCategoryId(id)
        setPrevCategoryName(prevName)
        setShowModal(true)
    }
    const addCategory = () => {
        setPrevCategoryName("")
        setCategoryId( false)
        setShowModal(true)
    }

    return (
        //Toto je layout pro list "Kategorie" na front endu.
        //Pokud by v programu byla přítomna autentifikace, pouze admin by k sem měl přístup.

        //Máme tlačítko "Přidat kategorii", které provolá API addCategory

        //Další dvě tlačítka "Upravit" a "Smazat" jsou u každé z kategorií a volají update/deleteCategory APIs.
        //Otevře se tím formulář z CategoryForm.js
        //Vzhledově jsou spojena v jeden <div>, aby byla u sebe. V souboru categories.module.css je pro
        //tlačítko "Upravit" navíc nastaveno pravé odsazení 1rem od druhého tlačítka (aby na sobě nebyly nalepené)
        <React.Fragment>
            <CategoryForm showModal={showModal} setShowModal={setShowModal} loadCategories={loadCategories}
                          categoryId={categoryId} prevCategoryName={prevCategoryName}/>
            <div>
                <Button className={classes['add-btn']} onClick={addCategory}>Přidat kategorii</Button>
                {categories.map((category) => {
                    return (
                        <Card key={category.id} className={classes.card}>
                            <Card.Body className={classes.body}>
                                <Card.Title className={classes.title}>{category.name}</Card.Title>
                                <div>
                                <Button variant={"warning"} className={classes["edit-btn"]}
                                        onClick={() => updateCategory(category.id, category.name)}>Upravit</Button>
                                <Button variant={"danger"}
                                        onClick={() => deleteCategory(category.id)}>Smazat</Button>
                                    </div>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        </React.Fragment>
    )
}

export default Categories;