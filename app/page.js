import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

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
		<div className="grow">
			<ul>
				{posts.map((post) => (
					<li key={post.slug}>
						<Link href={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
