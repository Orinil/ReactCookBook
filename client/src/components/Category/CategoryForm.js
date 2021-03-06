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
                //M??sto toho, abychom vytv????eli dva (t??m???? toto??n??) formul????e pro vytvo??en?? nov?? kategorie (1) a
                //pro editaci n??zvu existuj??c?? kategorie (2), zachovali jsme jen jeden, kter?? p??es podm??nku, jestli n??m p??ich??z??
                //id kategorie, jen trochu m??n??me. U??et???? se n??kolik ????dk?? k??du.

                //V n??zvu formul????e <Modal.Title> Ternary operator kontroluje, jestli jako parametr p??i??lo ID kategorie.
                //Podle toho se m??n?? n??zev formul????e ("Upravit kategorii" pokud v parametru ID je,
                //"P??idat kategorii", pokud ID nen??).

                //Podobn?? logika plat?? i pro n??zev potvrzovac??ho tla????tka. Podle existence id v parametru se tla????tko jmenuje
                //bud' "Upravit", nebo "P??idat"

                //Formul???? d??le obsahuje povinn?? pole N??zev. U??ivatel je upozorn??n a nepu??t??n d??l, pokud to pole nevypln??.
                <div className="categories-form">
                    <Modal show={showModal} onHide={onHide} backdrop={"static"}>
                        <Modal.Header closeButton>
                            <Modal.Title>{categoryId ? "Upravit kategorii" : "P??idat kategorii"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>N??zev</Form.Label>
                                    <Form.Control
                                        {...register("name", {required: true})}
                                        type="text"
                                        placeholder="N??zev kategorie"
                                    />
                                    <p className="form-error">{errors.name?.type === 'required' && "Povinn?? pole"}</p>
                                </Form.Group>
                                <Button variant="primary" type="submit" className={classes['submit-btn']}>
                                    {categoryId ? "Upravit" : "P??idat"}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
            )
        }
    }
export default CategoryForm;