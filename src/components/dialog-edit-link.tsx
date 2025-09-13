import { TLink } from "@/types/link.types";
import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button, ButtonLoading } from "./ui/button";
import { Input } from "./ui/input";
import { Shuffle } from "lucide-react";
import { toast } from "sonner";
import { patch } from "@/lib/request";

interface Props {
	link: TLink;
	open?: boolean;
	setOpen?: (val: boolean) => void;
	onChange?: (val: TLink) => void;
	typeLink: "desnitation" | "short-link" | "title";
}

const DialogEditLink = (props: Props) => {
	const { link, open, setOpen, typeLink, onChange } = props;
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open) {
			setValue(
				typeLink === "desnitation"
					? link.main_url
					: typeLink === "title"
					? link.url_title
					: link.domain
			);
		}
	}, [link, typeLink, open]);

	const handleChange = async (value: string) => {
		if (!value.trim()) {
			setOpen?.(false);
			return;
		}

		try {
			setLoading(true);
			let payload: Partial<TLink> = {};
			if (typeLink === "desnitation") {
				if (value.trim() === link.main_url.trim()) {
					setOpen?.(false);
					return;
				}

				payload = {
					main_url: value,
				};
			} else if (typeLink === "title") {
				if (value.trim() === link.url_title.trim()) {
					setOpen?.(false);
					return;
				}

				payload = {
					url_title: value,
				};
			}

			await patch(`/link/${link.code}`, payload);

			onChange?.({
				...link,
				...payload,
			} as TLink);
			setOpen?.(false);
			toast.success("Change successfully.");
		} catch (error) {
			console.log(error);
			toast.error("Edit link failure.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="w-full overflow-hidden">
				<DialogHeader className="w-full">
					<DialogTitle asChild className="w-full">
						<div className="flex items-center gap-4 w-full overflow-hidden">
							<div className="size-10 flex items-center justify-center bg-gray-200 rounded-full">
								<Shuffle size={20} />
							</div>
							<div className="flex flex-col items-start flex-1 overflow-hidden">
								<h2 className="text-lg font-semibold">
									Change the{" "}
									{typeLink === "desnitation"
										? "Desnitation Link"
										: typeLink === "title"
										? "Url Title"
										: "Short Link"}
								</h2>
								<p className=" text-gray-500 break-all line-clamp-1 text-ellipsis">
									{typeLink === "desnitation"
										? link.main_url
										: typeLink === "title"
										? link.url_title
										: ""}
								</p>
							</div>
						</div>
					</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<div className="py-6 max-w-full">
					<Input
						className="py-5 w-full"
						placeholder="Enter the desnitation here..."
						value={value}
						onChange={(e) => {
							setValue(e.target.value);
						}}
					/>
				</div>
				<DialogFooter>
					<ButtonLoading loading={loading} onClick={() => handleChange(value)}>
						Change
					</ButtonLoading>
					<DialogClose asChild>
						<Button variant={"outline"}>Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DialogEditLink;
