import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import {useEffect} from "react";
import classes from "./categoryForm.module.css";
    const CategoryForm = ({showModal, setShowModal, loadCategories, categoryId, originalName}) => {
        const {
            register,
            handleSubmit,
            resetField,
            formState: {errors}
        } = useForm({defaultValues: {name: originalName}});
        const CategoryForm = ({showModal, setShowModal, loadCategories, categoryId, prevCategoryName}) => {
            const {
                register,
                handleSubmit,
                resetField,
                setValue,
                formState: {errors}
            } = useForm({defaultValues: {name: prevCategoryName}});

            const addCategory = data => {
                fetch("http://localhost:3000/category/create", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(() => {
                    loadCategories()
                })
            }

            useEffect(() => {
                setValue("name", prevCategoryName)
            }, [prevCategoryName]);


            const onSubmit = data => {
                if (categoryId) {
                    data.id = categoryId
                    updateCategory(data)
                } else {
                    addCategory(data)
                }
                resetField("name");
                setShowModal(false);
            }

            const updateCategory = data => {
                fetch("http://localhost:3000/category/update", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(() => {
                    loadCategories()
                })
            }

            const onHide = () => {
                resetField("name")
                setShowModal(false)
            }

            return (
                //Místo toho, abychom vytvářeli dva (téměř totožné) formuláře pro vytvoření nové kategorie (1) a
                //pro editaci názvu existující kategorie (2), zachovali jsme jen jeden, který přes podmínku, jestli nám přichází
                //id kategorie, jen trochu měníme. Ušetří se několik řádků kódu.

                //V názvu formuláře <Modal.Title> Ternary operator kontroluje, jestli jako parametr přišlo ID kategorie.
                //Podle toho se mění název formuláře ("Upravit kategorii" pokud v parametru ID je,
                //"Přidat kategorii", pokud ID není).

                //Podobná logika platí i pro název potvrzovacího tlačítka. Podle existence id v parametru se tlačítko jmenuje
                //bud' "Upravit", nebo "Přidat"

                //Formulář dále obsahuje povinné pole Název. Uživatel je upozorněn a nepuštěn dál, pokud to pole nevyplní.
                <div className="categories-form">
                    <Modal show={showModal} onHide={onHide} backdrop={"static"}>
                        <Modal.Header closeButton>
                            <Modal.Title>{categoryId ? "Upravit kategorii" : "Přidat kategorii"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Název</Form.Label>
                                    <Form.Control
                                        {...register("name", {required: true})}
                                        type="text"
                                        placeholder="Název kategorie"
                                    />
                                    <p className="form-error">{errors.name?.type === 'required' && "Povinné pole"}</p>
                                </Form.Group>
                                <Button variant="primary" type="submit" className={classes['submit-btn']}>
                                    {categoryId ? "Upravit" : "Přidat"}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
            )
        }
    }
export default CategoryForm;