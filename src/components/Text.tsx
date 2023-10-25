export default function Text(props: { title: String }) {
  return (
    <div class="text-4xl font-black font-italic text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {props.title}
    </div>
  )
}
