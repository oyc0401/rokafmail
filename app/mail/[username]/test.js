export async function Test(params) {
  let text;

  return (
    <>
      <form onChange={(e) => {text = e.target.value}}></form>
      <button onClick={console.log(text)}></button>
    </>
  );
}
