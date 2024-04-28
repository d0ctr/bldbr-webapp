
const CardList = ({ cards }) => {
  return (
    <div>
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
};

export default CardList;