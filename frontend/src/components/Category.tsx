import "../styles/category.css";

type CategoryProps = {
  image: string;
  title: string;
  onSelect: () => void;
};
const Category = ({onSelect , image, title }: CategoryProps) => {
  return (
    <div className="category_container" onClick={onSelect}>
      <div className="image">
        <img src={image} alt={title} />
      </div>
      <div className="title">{title}</div>
    </div>
  );
};

export default Category;
