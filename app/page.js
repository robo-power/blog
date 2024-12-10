import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function Blogs() {
	const postsDirectory = path.join(process.cwd(), 'content');
	const fileNames = fs.readdirSync(postsDirectory);

	const posts = await Promise.all(
		fileNames.map(async (fileName) => {
			const filePath = path.join(postsDirectory, fileName);
			const fileContents = fs.readFileSync(filePath, 'utf8');
			const { data } = matter(fileContents);

			return {
				slug: fileName.replace('.md', ''),
				frontmatter: data,
			};
		})
	).then((posts) => 
		posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
	);

	return (
		<div className="grow px-6 py-0 lg:px-8">
			<div className="mx-auto max-w-4xl text-base leading-7">
				<p>現在制作中ですが少しずつ記事を書いていきます。</p>
				<div className="grid xl:grid-cols-2 grid-cols-1 xl:place-content-center place-items-center">
					{posts.map((post) => (
						<div key={post.slug} className='my-4 content-center w-80 xl:w-96 bg-white text-center shadow-md shadow-orange-300 text-xl flex items-center justify-center py-4 hover:bg-orange-300 group transition duration-300'>
							<a href={`/blog/${post.slug}`} className='group-hover:text-white transition duration-300'>{post.frontmatter.title}</a>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
