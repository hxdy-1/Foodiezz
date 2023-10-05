import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";
import { useEffect, useState } from "react";

const AvailableMeals = () => {
    const [mealsArr, setMealsArr] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState();

    useEffect(() => {
        setIsLoading(true);
        const fetchMeals = async () => {
            const response = await fetch(
                "https://foodiezz-dff0d-default-rtdb.firebaseio.com/meals.json"
            );

            if (!response.ok) {
                throw new Error("Failed to load meals :(");
            }

            const data = await response.json();
            // console.log(data);
            const loadedMeals = [];

            for (const key in data) {
                loadedMeals.push({
                    id: key,
                    name: data[key].name,
                    description: data[key].description,
                    price: data[key].price,
                });
            }

            setMealsArr(loadedMeals);
            setIsLoading(false);
        };

        fetchMeals().catch((err) => {
            console.error(err);
            setIsLoading(false);
            setHasError(err.message);
        });
    }, []);

    if (isLoading) {
        return (
            <section style={{ color: "white", textAlign: "center" }}>
                <h3>Loading Meals...</h3>
            </section>
        );
    }

    if (hasError) {
        return (
            <section style={{ color: "red", textAlign: "center" }}>
                <h3>{hasError}</h3>
            </section>
        );
    }

    const mealsList = mealsArr.map((meal) => (
        <MealItem
            key={meal.id}
            id={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}
        />
    ));

    return (
        <section className={classes.meals}>
            <Card>
                <ul>{mealsList}</ul>
            </Card>
        </section>
    );
};

export default AvailableMeals;
