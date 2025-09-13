/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { Eye, Link, Share2, Target } from "lucide-react";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import CardItemLink from "./card-item-link";
import HeadTitle from "./head-title";
import { toast } from "sonner";
import { del, get } from "@/lib/request";
import { TLink } from "@/types/link.types";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PaginationComponent from "./pagination-component";
import AlertDialogConfirm from "./alert-dialog-confirm";
import { deleteQueryString } from "@/lib/utils";
import CardItemLinkLoading from "./card-item-link-loading";

interface Props {
	data_statistic: {
		total_view: number;
		total_link: number;
	} | null;
}

const ListLinks = () => {
	const [links, setLinks] = useState<TLink[]>([]);
	const [totalPage, setTotalPage] = useState(1);
	const [selectedKey, setSelectedKey] = useState<number[]>([]);
	const [openDialogBulkDelete, setOpenDialogBulkDelete] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [loading, setLoading] = useState(true);

	const params = useSearchParams();
	const page = params.get("page") || 1;
	const router = useRouter();
	const pathname = usePathname();

	const getLinks = useCallback(async () => {
		try {
			setLoading(true);
			const response = (await get(`/link?page=${page}&limit=10`)) as {
				links: TLink[];
				total_record: number;
				total_page: number;
			};

			setTotalPage(response.total_page);
			setLinks(response.links);
			setSelectedKey([]);
		} catch (error) {
			console.log(error);
			toast.error("Fetch links occurred error!");
		} finally {
			setLoading(false);
		}
	}, [page]);

	useEffect(() => {
		getLinks();
	}, [getLinks]);

	const handleBulkDelete = async () => {
		try {
			setDeleting(true);
			await del("/link/bulk", {
				ids: selectedKey,
			});
			setOpenDialogBulkDelete(false);
			toast.success(`Delete ${selectedKey.length} items success.`);
			setLinks((prev) => {
				return prev.filter((li) => !selectedKey.includes(li.id));
			});

			if (selectedKey.length === links.length) {
				if (page !== "1") {
					const query = deleteQueryString("page", params);
					router.push(`${pathname}${query ? `?${query}` : ""}`);
				} else {
					await getLinks();
				}
			}
			setSelectedKey([]);
		} catch (error) {
			console.log(error);
			toast.error("Delete failure.");
		} finally {
			setDeleting(false);
		}
	};

	if (loading) {
		return <ListSkeleton />;
	}

	return links.length > 0 ? (
		<div className="mt-8">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<Checkbox
						id="selected_all"
						checked={
							links.length > 0
								? selectedKey.length === links.length
									? true
									: selectedKey.length > 0
									? "indeterminate"
									: false
								: false
						}
						onCheckedChange={(e) => {
							if (e) {
								setSelectedKey(links.map((link) => link.id));
							} else {
								setSelectedKey([]);
							}
						}}
					/>
					<Label htmlFor="selected_all">Select All</Label>
				</div>
				<button
					disabled={selectedKey.length <= 0}
					className="not-disabled:hover:text-primary disabled:cursor-not-allowed not-disabled:hover:underline disabled:text-gray-500 dark:disabled:text-gray-400 dark:text-gray-200 text-gray-700 transition-colors cursor-pointer"
					onClick={() => setOpenDialogBulkDelete(true)}
				>
					Delete
				</button>
			</div>
			<div className="flex flex-col flex-1 gap-10 mt-4">
				{links.map((link) => {
					return (
						<CardItemLink
							link={link}
							key={link.id}
							onDelete={(val) => {
								setLinks(links.filter((item) => item.id !== val.id));
							}}
							selectedKey={selectedKey}
							setSelectedKey={setSelectedKey}
						/>
					);
				})}
			</div>
			{totalPage > 1 && Number(page) <= totalPage ? (
				<div className="mt-4">
					<PaginationComponent
						totalPage={totalPage}
						className="justify-center"
					/>
				</div>
			) : (
				<div className="h-10" />
			)}

			<AlertDialogConfirm
				open={openDialogBulkDelete}
				setOpen={setOpenDialogBulkDelete}
				onOk={handleBulkDelete}
				description={
					<p>
						This action cannot be undone.{" "}
						<span className="font-semibold">
							{selectedKey.length} items selected{" "}
						</span>{" "}
						will be delete from our server.
					</p>
				}
				loading={deleting}
			/>
		</div>
	) : (
		<div className="py-14 flex flex-col items-center justify-center mt-8 text-center">
			<div className="size-20 flex items-center justify-center bg-gray-200 rounded-full">
				<Link size={38} className="text-gray-500" />
			</div>
			<div className="mt-6 space-y-1">
				<h2 className="text-xl font-bold text-gray-500">No Link Created</h2>
				<p className="text-gray-500">
					Go to{" "}
					<a
						href="/user/create-link"
						className="italic font-semibold underline"
					>
						Create new link
					</a>{" "}
					to create shorten link
				</p>
			</div>
		</div>
	);
};

const ListSkeleton = () => {
	return (
		<div className="mt-14 flex flex-col gap-10">
			{Array.from({ length: 10 }).map((_, index) => (
				<CardItemLinkLoading key={index} />
			))}
		</div>
	);
};

const DashBoardPage = (props: Props) => {
	const { data_statistic } = props;

	return (
		<div className="bg-gray-50 dark:bg-black flex flex-col w-full h-full p-6">
			<HeadTitle title="Dashboard" />
			<div className="lg:grid-cols-4 sm:grid-cols-2 grid gap-10 mt-6">
				<Statistics
					title="Number Of Click"
					icon={<Eye strokeWidth={2} />}
					classIcon="bg-cyan-500/10 text-cyan-500"
					value={data_statistic?.total_view}
				/>
				<Statistics
					title="Links"
					icon={<Link strokeWidth={2} />}
					classIcon="bg-yellow-100/40 text-yellow-500"
					value={data_statistic?.total_link}
				/>
				<Statistics
					icon={<Share2 strokeWidth={2} />}
					classIcon="bg-green-500/10 text-green-500"
				/>
				<Statistics
					icon={<Target strokeWidth={2} />}
					classIcon="bg-red-500/10 text-red-500"
				/>
			</div>

			<Suspense fallback={<ListSkeleton />}>
				<ListLinks />
			</Suspense>
		</div>
	);
};

const Statistics = ({
	title,
	icon,
	value,
	classIcon,
	classValue,
	classTitle,
}: {
	title?: string | React.ReactNode;
	icon?: React.ReactNode;
	value?: string | number | React.ReactNode;
	classIcon?: string;
	classValue?: string;
	classTitle?: string;
}) => {
	return (
		<div className="dark:bg-neutral-800 dark:shadow w-full h-full bg-white rounded-sm">
			<div
				className={`py-2 px-3 border-b border-gray-100 font-semibold text-purple-800 dark:text-purple-700 ${classTitle}`}
			>
				{title || "-"}
			</div>
			<div className="flex flex-col items-center gap-2 py-6">
				<div
					className={`size-16 rounded-full flex items-center justify-center ${classIcon}`}
				>
					{icon || "-"}
				</div>
				<div
					className={`mt-4 text-xl font-bold text-purple-800 dark:text-purple-700 ${classValue}`}
				>
					{!isNaN(value as number) ? value : "-"}
				</div>
			</div>
		</div>
	);
};

export default DashBoardPage;
