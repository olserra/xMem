'use client'

import Image from "next/image";


export const Feedback = () => {
    return (
        <div>
            <div className="mb-6 px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
                        Feedback
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        What are people saying about OpenSkill
                    </p>
                </div>
            </div>
            {/* steps */}

            <div>
                <div className="mx-auto flex max-w-6xl justify-center px-6 lg:px-8">
                    <div className="flow-root">
                        <div className="-m-2 w-fit rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10  lg:-m-4 lg:rounded-2xl lg:p-4">
                            <Image
                                width={2556}
                                height={1436}
                                quality={100}
                                src="/tweet_collage.png"
                                alt="Header image"
                                className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10 md:p-8"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}