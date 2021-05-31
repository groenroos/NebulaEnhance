declare namespace Github {
    type Author = {
        login: string,
        id: number,
        node_id: string,
        avatar_url: string,
        gravatar_id: string,
        url: string,
        html_url: string,
        followers_url: string,
        following_url: string,
        gists_url: string,
        starred_url: string,
        subscriptions_url: string,
        organizations_url: string,
        repos_url: string,
        events_url: string,
        received_events_url: string,
        type: string,
        site_admin: false,
    }

    type Asset = {
        url: string,
        browser_download_url: string,
        id: number,
        node_id: string,
        name: string,
        label: string,
        state: string,
        content_type: string,
        size: number,
        download_count: number,
        created_at: string,
        updated_at: string,
        uploader: Author,
    }

    type Release = {
        url: string,
        html_url: string,
        asserts_url: string,
        tarball_url: string,
        zipball_url: string,
        id: number,
        node_id: string,
        tag_name: string,
        target_commitish: string,
        name: string,
        body: string,
        draft: false,
        prerelease: false,
        created_at: string,
        published_at: string,
        author: Author,
        assets: Asset[],
    }
}