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
			<div className="mx-auto max-w-3xl text-base leading-7">
				<p>現在制作中ですが少しずつ記事を書いていきます。</p>
				<ul>
					{posts.map((post) => (
						<li key={post.slug}>
							<a href={`/blog/${post.slug}`}>{post.frontmatter.title}</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
