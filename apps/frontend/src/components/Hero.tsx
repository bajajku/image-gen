export const Hero = () => {
    return (
        <div className="relative py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <div className="relative mb-6 floating">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg">
                        <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                <h1 className="font-bold mb-6 gradient-text text-6xl/[92px]">
                    SynthLabel
                </h1>
                <p className="text-xl text-high-contrast max-w-2xl mx-auto leading-relaxed">
                    Your one-stop destination for efficient and accurate data labeling. Upload your images and get them labeled by our expert workforce.
                </p>
            </div>
        </div>
    );
}