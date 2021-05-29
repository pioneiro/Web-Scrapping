window.onload = () => {
	const id = document.getElementById("id").textContent;
	const positive = document.querySelector(".positive");
	const failedList = document.querySelector(".failedList");

	const socket = io();

	socket.emit("established", id);

	socket.on("incoming", (data) => {
		const page = `
		<div class="page">
			<div class="tab">
				<div class="url">${data.url}</div>
			</div>
			<div class="content">
				<div class="details">
					<div class="title">
						<img
							class="favicon"
							src="${data.favicon}"
							alt="${data.url} favicon"
						/>
						${data.title}
					</div>
					<div class="description">
						${data.description}
					</div>
				</div>
				<img
					class="image"
					src="${data.image}"
					alt="${data.url} image"
				/>
			</div>
		</div>
		`;

		positive.innerHTML += page;
	});

	socket.on("error", ({ url, error }) => {
		const errorItem = `
		<li>
			<div class="url">${url}</div>
			<div class="error">${error}</div>
		</li>
		`;

		failedList.innerHTML += errorItem;
	});
};
