import Head from 'next/head'
import Image from 'next/image'
import bgImage from '@images/bg.png'
import cardImg from '@images/card.jpg'
import Avatar from '@/components/Avatar'
import { LensProfile } from '@/types/lens'
import { Filter } from '@/types/ui'
import { FC, useState } from 'react'
import { useQuery } from '@apollo/client'
import EXPLORE_PROFILES from '@/queries/explore-profiles'

const PAGE_LENGTH = 10

const filters: Record<'followers' | 'posts' | 'collects' | 'active', Filter> = {
	followers: {
		label: 'Followers',
		key: 'MOST_FOLLOWERS',
		item: (profile: LensProfile) => profile.stats.totalFollowers,
	},
	posts: { label: 'Posts', key: 'MOST_POSTS', item: (profile: LensProfile) => profile.stats.totalPosts },
	active: {
		label: 'Active',
		key: 'MOST_PUBLICATION',
		item: (profile: LensProfile) => profile.stats.totalPublications,
	},
	collects: { label: 'Collects', key: 'MOST_COLLECTS', item: (profile: LensProfile) => profile.stats.totalCollects },
}

const meta = {
	title: `Lens Leaderboard: Most followed, active, collected & shared profiles`,
	description: `Open protocols offer new levels of transparency. This leaderboard uses 100% public data to rank notable profiles on the Lens Protocol.`,
	image: `https://leaderboard.withlens.app${cardImg.src}`,
}

const Home: FC = () => {
	const [filterBy, setFilter] = useState<Filter>(filters.followers)
	const [page, setPage] = useState<number>(0)
	const { data, loading } = useQuery(EXPLORE_PROFILES, {
		variables: { sortCriteria: filterBy.key, cursor: JSON.stringify({ offset: page * PAGE_LENGTH }) },
	})

	const changeFilter = (filter: Filter) => {
		setFilter(filter)
		setPage(0)
	}

	const profiles = data?.exploreProfiles?.items

	return (
		<>
			<Head>
				<title>{meta.title}</title>
				<meta name="title" content={meta.title} />
				<meta name="description" content={meta.description} />

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://leaderboard.withlens.app" />
				<meta property="og:title" content={meta.title} />
				<meta property="og:description" content={meta.description} />
				<meta property="og:image" content={meta.image} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://leaderboard.withlens.app" />
				<meta property="twitter:title" content={meta.title} />
				<meta property="twitter:description" content={meta.description} />
				<meta property="twitter:image" content={meta.image} />
			</Head>
			<div className="flex flex-col min-h-screen items-center justify-center">
				<div className="fixed inset-0 -z-10 h-screen">
					<Image src={bgImage} placeholder="blur" layout="fill" alt="" />
				</div>
				<div className="pb-6 space-y-1 pt-6 md:pt-0 px-4 md:px-0">
					<h1 className="text-4xl font-bold text-center mb-3">Lens Leaderboard</h1>
					<p className="text-black/60 max-w-prose mx-auto text-center">
						Open protocols offer new levels of transparency. This leaderboard uses 100% public data to rank
						the most popular and active profiles on the Lens Protocol.
					</p>
				</div>
				<div className="space-x-6 mb-6">
					{Object.entries(filters).map(([filterName, filter]) => (
						<button
							key={filterName}
							className={`font-medium transition ${
								filterBy.label == filter.label ? '' : 'text-black/40'
							}`}
							onClick={() => changeFilter(filter)}
						>
							{filter.label}
						</button>
					))}
				</div>
				<div className="max-w-5xl mx-auto w-full py-2 px-6">
					{loading && (
						<div className="flex items-center justify-center pt-12">
							<p className="text-black/60">Loading...</p>
						</div>
					)}
					<div className="grid md:grid-cols-2 gap-4 mb-4">
						{profiles &&
							profiles.map((profile, i) => (
								<div
									key={i}
									className="flex items-center justify-between shadow rounded-xl py-2 px-4 relative bg-white/70 backdrop-filter backdrop-blur-sm backdrop-saturate-150"
								>
									<div
										className={`absolute -top-2 -right-2 bg-white text-xl rounded-full w-8 h-8 flex items-center justify-center shadow ${
											page * PAGE_LENGTH + i + 1 >= 1000
												? 'text-xs'
												: page * PAGE_LENGTH + i + 1 >= 100
												? 'text-base'
												: ''
										}`}
									>
										{page * PAGE_LENGTH + i + 1}
									</div>
									<div className="flex items-center">
										<Avatar profile={profile} />
										<div className="ml-4">
											<p className="text-lg">{profile.name ?? profile.handle}</p>
											<div className="flex items-center">
												<a
													href={`https://lenster.xyz/u/${profile.handle}`}
													className="text-sm text-gray-600 -mt-1 block"
												>
													@{profile.handle}
												</a>
											</div>
										</div>
									</div>
									<div className="mr-4">
										<p className="text-lg text-right">{filterBy.item(profile)}</p>
										<p className="lowercase text-black/40 text-sm -mt-1">{filterBy.label}</p>
									</div>
								</div>
							))}
					</div>
					{profiles && (
						<div className="flex items-center justify-end space-x-4 text-white">
							{page != 0 && (
								<button className="text-sm" onClick={() => setPage(page - 1)}>
									&larr; Prev Page
								</button>
							)}
							<button className="text-sm" onClick={() => setPage(page + 1)}>
								Next Page &rarr;
							</button>
						</div>
					)}
				</div>
				<p className="md:absolute bottom-4 md:bottom-6 inset-x-0 text-center text-white/90 pt-4 pb-6 md:py-0">
					Built by{' '}
					<a
						className="font-semibold text-white"
						href="https://lenster.xyz/u/m1guelpf.lens"
						target="_blank"
						rel="noreferrer"
					>
						@m1guelpf.lens
					</a>
				</p>
			</div>
		</>
	)
}

export default Home
