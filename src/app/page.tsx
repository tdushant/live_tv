import TVApp from "@/app/components/tv-app";
import 'video.js/dist/video-js.css'; // Core Video.js styles
import '@videojs/themes/dist/forest/index.css'; // Forest theme styles


export default function Home() {
	console.log("You are working on right way..");
	return (
		<>
			<main>
				<TVApp />
			</main>
		</>
	)
}
