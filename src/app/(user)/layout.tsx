import { Toaster } from "react-hot-toast";
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col min-h-screen">
			{/* <Navbar />  */}

			<main className="flex-1">
				{children}
				<Toaster
					position="top-center"
					toastOptions={{
						duration: 4000,
					}}
				/>
			</main>
		</div>
	);
}