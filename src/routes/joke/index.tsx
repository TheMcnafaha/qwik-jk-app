import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  server$,
} from "@builder.io/qwik-city";

let lolArr = [];
export const useDadJoke = routeLoader$(async function getJokeFromDB() {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: { Accept: `application/json` },
  });
  console.log("hit endpoint");

  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});
export const useJoveVoteAction = routeAction$((props) => {
  console.log("Voted: ", props);
  const coolObj = { ...props };
  lolArr.push(props);

  console.log("Total: ", lolArr);
});
export default component$(() => {
  const isFavoriteSignal = useSignal(false);
  const dadJokeSignal = useDadJoke();
  const favoriteAction = useJoveVoteAction();
  useTask$(({ track }) => {
    track(() => isFavoriteSignal.value);
    console.log("FAVORITE (ISO)", isFavoriteSignal.value);
    server$(() => {
      console.log("FAVORITE (SER)", isFavoriteSignal.value);
    })();
  });
  return (
    <section class="flex  flex-col gap-4 max-w-md  p-4">
      <p class=" rounded-lg border-2  border-purple-950 bg-purple-900 p-4">
        {" "}
        {dadJokeSignal.value.joke}
      </p>
      <div class=" flex justify-between ">
        <button
          class="rounded-md border-2 border-blue-950 bg-violet-600 px-2 py-1 "
          onClick$={() => {
            isFavoriteSignal.value = !isFavoriteSignal.value;
          }}
        >
          {isFavoriteSignal.value ? "❤️" : "🤍"}
        </button>
        <Form
          action={favoriteAction}
          onSubmit$={() => {
            isFavoriteSignal.value = false;
          }}
          class="flex justify-between  "
        >
          <div class=" flex max-w-[100px] justify-between gap-4 ">
            <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
            <button
              name="vote"
              value="up"
              class="rounded-md border-2 border-blue-950 bg-violet-600 px-2 py-1 "
            >
              👍
            </button>
            <button
              name="vote"
              value="down"
              class=" rounded-md border-2 border-blue-950 bg-violet-600 px-2 py-1 "
            >
              👎
            </button>
            <input
              type="hidden"
              name="isFav"
              value={`${isFavoriteSignal.value}`}
            />
          </div>
        </Form>
      </div>
    </section>
  );
});
