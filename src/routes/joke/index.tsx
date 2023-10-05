import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import {
  Form,
  routeAction$,
  routeLoader$,
  server$,
} from "@builder.io/qwik-city";

export const useDadJoke = routeLoader$(async function getJokeFromDB() {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: { Accept: `application/json` },
  });
  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});
export const useJoveVoteAction = routeAction$((props) => {
  console.log("Voted: ", props);
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
    <section class="flex  flex-col gap-4  p-4">
      <p class=" rounded-lg border-2 border-purple-950 bg-purple-900 p-4">
        {" "}
        {dadJokeSignal.value.joke}
      </p>
      <Form action={favoriteAction} class="flex justify-between ">
        <button
          class="rounded-md border-2 border-blue-950 bg-violet-600 px-2 py-1 "
          onClick$={() => {
            isFavoriteSignal.value = !isFavoriteSignal.value;
          }}
        >
          {isFavoriteSignal.value ? "❤️" : "🤍"}
        </button>
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
        </div>
      </Form>
    </section>
  );
});
