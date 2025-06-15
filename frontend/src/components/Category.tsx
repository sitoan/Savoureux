import "../styles/category.css";

type CategoryProps = {
  image: string;
  title: string;
};
const Category = ({ image, title }: CategoryProps) => {
  return (
    <div className="category_container">
      <div className="image">
        <img src={image} alt={title} />
      </div>
      <div className="title">{title}</div>
    </div>
  );
};

export default Category;
